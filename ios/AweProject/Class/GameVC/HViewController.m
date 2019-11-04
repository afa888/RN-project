//
//  HViewController.m
//  TestProject
//
//  Created by dqf on 2018/4/27.
//  Copyright © 2018年 dqfStudio. All rights reserved.
//

#import "HViewController.h"
#import <objc/runtime.h>
#import "UIApplication+HUtil.h"
#import "NSObject+HSwizzleUtil.h"
#import "NSObject+HUtil.h"
#import "UIView+HUtil.h"

@implementation AppDelegate (HRotate)
+ (BOOL)shouldAutorotate {
    return [objc_getAssociatedObject(self, _cmd) boolValue];
}
+ (void)setShouldAutorotate:(BOOL)shouldAutorotate {
    objc_setAssociatedObject(self, @selector(shouldAutorotate), @(shouldAutorotate), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    if (AppDelegate.shouldAutorotate) {
        return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight;
    }
    return UIInterfaceOrientationMaskPortrait;
}
@end

#define IS_KIPHONEX ([UIScreen mainScreen].bounds.size.width == 375.f && [UIScreen mainScreen].bounds.size.height == 812.f ? YES : NO)

@interface HViewControllerMgr : NSObject <UIGestureRecognizerDelegate>

@end

@implementation HViewControllerMgr :NSObject
+ (instancetype)shared {
    static dispatch_once_t pred;
    static HViewControllerMgr *o = nil;
    dispatch_once(&pred, ^{ o = [[self alloc] init]; });
    return o;
}
//防止导航控制器只有一个rootViewcontroller时触发手势
- (BOOL)gestureRecognizerShouldBegin:(UIPanGestureRecognizer *)gestureRecognizer {
    // 解决右滑和UITableView左滑删除的冲突
    CGPoint translation = [gestureRecognizer translationInView:gestureRecognizer.view];
    if (translation.x <= 0) {
        return NO;
    }
    return (UIApplication.navi.viewControllers.count > 1);
}
@end


#define HTopBarHeight 44.0f
#define HStatusBarHeight (IS_KIPHONEX?44.0:20.0f)
#define HNavTitleButtonWidth 70.0f
#define HNavTitleButtonMargin 10.0f


@implementation HVCAppearance

- (instancetype)init {
    self = [super init];
    if (self) {
        _barColor = [UIColor whiteColor];
        _bgColor = [UIColor whiteColor];
        _textColor = [UIColor blackColor];
        _lightTextColor = [UIColor lightGrayColor];
    }
    return self;
}
+ (instancetype)shared {
    static dispatch_once_t pred;
    static HVCAppearance *o = nil;
    dispatch_once(&pred, ^{
        o = [[self alloc] init];
    });
    return o;
}

@end


@interface HViewController ()

@property (nonatomic) NSMutableArray *controllableRequests;

//topBar的顶部内边距,如果有statusBar没有系统导航栏的情况下为statusbar的高度(20)
@property (nonatomic) CGFloat topBarTopPadding;

@end

@implementation HViewController

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [[self class] methodSwizzleWithOrigSEL:@selector(viewWillAppear:) overrideSEL:@selector(pvc_viewWillAppear:)];
    });
}
- (void)pvc_viewWillAppear:(BOOL)animated {
    [self pvc_viewWillAppear:animated];
    [AppDelegate setShouldAutorotate:self.shouldAutorotate];
}

//一般情况下调用 init 方法或者调用 initWithNibName 方法实例化 UIViewController, 不管调用哪个方法都为调用 initWithNibName
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        [self pvc_initialize];
    }
    return self;
}

//使用storeBoard初始化的
- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self)
    {
        [self pvc_initialize];
    }
    return self;
}

- (void)pvc_initialize {
    _topBarTopPadding = 0;
    
    //只有statusBar没有系统导航栏的情况下,statusBar背景色是透明的需要自定义的导航栏多增加一点高度来伪造statusBar的背景
    if (![self prefersStatusBarHidden] && ![self prefersNavigationBarHidden]) {
        _topBarTopPadding = HStatusBarHeight;
    }
}
+ (HVCAppearance *)appearance {
    return [HVCAppearance shared];
}
//loadView 从nib载入视图 ，通常这一步不需要去干涉。除非你没有使用xib文件创建视图,即用代码创建的UI
- (void)loadView {
    [super loadView];
    [self pvc_initView];
}

- (void)pvc_initView {
    [self setNeedsNavigationBarAppearanceUpdate];
  [self.leftNaviButton setBackgroundImage:[UIImage imageNamed:@"icon_back_co2"] forState:UIControlStateNormal];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    if (_controllableRequests) {
        [_controllableRequests enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            //[(HNetworkDAO*)obj cancel];
        }];
    }
    _controllableRequests = nil;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    if (self.title.length > 0) {
        self.titleLabel.text = self.title;
    }
    self.view.backgroundColor = [HViewController appearance].bgColor;
    [self.view addSubview:self.topBar];
    self.view.exclusiveTouch = YES;
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self becomeFirstResponder];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
//    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];//设置为白色状态栏
    [self.view bringSubviewToFront:self.topBar];
    //要更新statusbar状态的需要调用下这个方法,最好与viewWillDisappear对应
    [self setNeedsStatusBarAppearanceUpdate];
    self.navigationController.interactivePopGestureRecognizer.enabled = [self popGestureEnabled];
    self.navigationController.interactivePopGestureRecognizer.delegate = [HViewControllerMgr shared];
#ifdef __IPHONE_11_0
    if (@available(iOS 11.0, *)) {
        if ([self.view isKindOfClass:[UIScrollView class]]) {
            [(UIScrollView *)self.view setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];
        }
        for (UIView *view in self.view.subviews) {
            if ([view isKindOfClass:[UIScrollView class]]) {
                [(UIScrollView *)view setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];
            }
        }
    }else{
        SuppressWdeprecatedDeclarationsWarning(
            self.automaticallyAdjustsScrollViewInsets = NO;
        );
    }
#else
    self.automaticallyAdjustsScrollViewInsets = NO;
#endif
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
//    [self setNeedsStatusBarAppearanceUpdate];
}

#pragma mark - 事件处理
- (void)back {
    if (self.presentedViewController || self.presentingViewController) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }else {
        [self.navigationController popViewControllerAnimated:YES];
    }
}

- (void)leftNaviButtonPressed {
    [self back];
}

- (void)rightNaviButtonPressed {
    
}

#pragma mark - 各个视图
- (UIButton *)topBar {
    if (!_topBar) {
        _topBar = [[UIButton alloc] init];
        //没有系统导航栏的时候,status背景色是透明的,用自定义导航栏去伪造一个status背景区域
        if([self prefersNavigationBarHidden]) {
            _topBar.frame = CGRectMake(0, _topBarTopPadding, self.view.h_width, HTopBarHeight);
        }else {
            _topBar.frame = CGRectMake(0, 0, self.view.h_width, HTopBarHeight + _topBarTopPadding);
            _topBar.bounds = CGRectMake(0, -_topBarTopPadding, self.view.h_width, HTopBarHeight + _topBarTopPadding);
        }
        _topBar.autoresizingMask = UIViewAutoresizingFlexibleWidth;
        _topBarLine = [[UIView alloc] init];
        _topBarLine.frame = CGRectMake(0, HTopBarHeight - 1, _topBar.h_width, 1);
        [_topBar addSubview:_topBarLine];
        _topBarLine.hidden = [self prefersTopBarLineHidden];
    }
    return _topBar;
}
- (float)topBarHeight {
    return ([self prefersStatusBarHidden]?0:HStatusBarHeight) + ([self prefersNavigationBarHidden]?0:HTopBarHeight);
}
- (UILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        _titleLabel.frame = CGRectMake(54, 0, self.view.h_width - 54 * 2, HTopBarHeight);
        _titleLabel.textAlignment = NSTextAlignmentCenter;
        _titleLabel.textColor = [UIColor blackColor];
        _titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [self.topBar addSubview:_titleLabel];
    }
    return _titleLabel;
}

- (UIButton *)leftNaviButton {
    if (!_leftNaviButton) {
        _leftNaviButton = [[UIButton alloc] init];
        _leftNaviButton.backgroundColor = nil;
        _leftNaviButton.frame = CGRectMake(10, 0, HTopBarHeight, HTopBarHeight);
        [_leftNaviButton setFont:[UIFont systemFontOfSize:16]];
        _leftNaviButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        [_leftNaviButton addTarget:self action:@selector(leftButtonClick:) forControlEvents:UIControlEventTouchUpInside];
        _leftNaviButton.imageView.contentMode = UIViewContentModeCenter;
        [self.topBar addSubview:_leftNaviButton];
    }
    return _leftNaviButton;
}

- (void)leftButtonClick:(id)sender {
  [self leftNaviButtonPressed];
}

- (UIButton *)rightNaviButton {
    if (!_rightNaviButton) {
        _rightNaviButton = [[UIButton alloc] init];
        _rightNaviButton.backgroundColor = nil;
        [_rightNaviButton setFont:[UIFont systemFontOfSize:16]];
        _rightNaviButton.frame = CGRectMake(self.topBar.h_width - HTopBarHeight, 0, HTopBarHeight, HTopBarHeight);
        _rightNaviButton.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin;
        _rightNaviButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter;
      [_rightNaviButton addTarget:self action:@selector(rightButtonClick:) forControlEvents:UIControlEventTouchUpInside];
        [self.topBar addSubview:_rightNaviButton];
    }
    return _rightNaviButton;
}

- (void)rightButtonClick:(id)sender {
  [self rightNaviButtonPressed];
}

#pragma mark - 设置视图

- (void)setTitle:(NSString *)title {
    [super setTitle:title];
    if (self.viewLoaded) {
        self.titleLabel.text = title;
    }
}

- (void)setNaviBgImage:(UIImage *)image {
    [self.topBar setTitle:@"" forState:UIControlStateNormal];
    [self.topBar setTitle:@"" forState:UIControlStateHighlighted];
    [self.topBar setImage:image forState:UIControlStateNormal];
    [self.topBar setImage:image forState:UIControlStateSelected];
    [self.topBar setImage:image forState:UIControlStateHighlighted];
}

- (void)setLeftNaviImage:(UIImage *)image {
    [self.leftNaviButton setTitle:@"" forState:UIControlStateNormal];
    [self.leftNaviButton setTitle:@"" forState:UIControlStateHighlighted];
    [self.leftNaviButton setImage:image forState:UIControlStateNormal];
    [self.leftNaviButton setImage:image forState:UIControlStateHighlighted];
//    [self.leftNaviButton setRenderColor:[HSkinManager textColor]];
}

- (void)setNaviLeftImage:(UIImage *)normal highlight:(UIImage *)highlight {
    [self.leftNaviButton setTitle:@"" forState:UIControlStateNormal];
    [self.leftNaviButton setTitle:@"" forState:UIControlStateHighlighted];
    [self.leftNaviButton setImage:normal forState:UIControlStateNormal];
    [self.leftNaviButton setImage:highlight forState:UIControlStateHighlighted];
}

- (void)setRightNaviImage:(UIImage *)image {
    [self.rightNaviButton setTitle:@"" forState:UIControlStateNormal];
    [self.rightNaviButton setTitle:@"" forState:UIControlStateHighlighted];
    [self.rightNaviButton setImage:image forState:UIControlStateNormal];
    [self.rightNaviButton setImage:image forState:UIControlStateHighlighted];
//    [self.rightNaviButton setRenderColor:[HSkinManager specialColor]];
}

- (void)setNaviRightImage:(UIImage *)normal highlight:(UIImage *)highlight {
    [self.rightNaviButton setTitle:@"" forState:UIControlStateNormal];
    [self.rightNaviButton setTitle:@"" forState:UIControlStateHighlighted];
    [self.rightNaviButton setImage:normal forState:UIControlStateNormal];
    [self.rightNaviButton setImage:highlight forState:UIControlStateHighlighted];
}
- (void)setLeftNaviTitle:(NSString *)title {
    [self.leftNaviButton setImage:nil forState:UIControlStateNormal];
    [self.leftNaviButton setImage:nil forState:UIControlStateHighlighted];
    [self.leftNaviButton setTitle:title forState:UIControlStateNormal];
    [self.leftNaviButton setTitle:title forState:UIControlStateHighlighted];
}
- (void)setLeftNaviTitle:(NSString *)title titleColor:(UIColor *)color highlightColor:(UIColor *)highlightcolor {
    [self.leftNaviButton setImage:nil forState:UIControlStateNormal];
    [self.leftNaviButton setImage:nil forState:UIControlStateHighlighted];
    [self.leftNaviButton setTitle:title forState:UIControlStateNormal];
    [self.leftNaviButton setTitle:title forState:UIControlStateHighlighted];
    [self.leftNaviButton setTitleColor:color forState:UIControlStateNormal];
    [self.leftNaviButton setTitleColor:highlightcolor forState:UIControlStateHighlighted];
    self.leftNaviButton.titleLabel.font = [UIFont systemFontOfSize:15];
    self.leftNaviButton.frame = CGRectMake(HNavTitleButtonMargin, self.rightNaviButton.h_y, HNavTitleButtonWidth, self.rightNaviButton.h_height);
}
- (void)setRightNaviTitle:(NSString *)title {
    [self.rightNaviButton setImage:nil forState:UIControlStateNormal];
    [self.rightNaviButton setImage:nil forState:UIControlStateHighlighted];
    [self.rightNaviButton setTitle:title forState:UIControlStateNormal];
    [self.rightNaviButton setTitle:title forState:UIControlStateHighlighted];
}
- (void)setRightNaviTitle:(NSString *)title titleColor:(UIColor *)color highlightColor:(UIColor *)highlightcolor {
    [self.rightNaviButton setImage:nil forState:UIControlStateNormal];
    [self.rightNaviButton setImage:nil forState:UIControlStateHighlighted];
    [self.rightNaviButton setTitle:title forState:UIControlStateNormal];
    [self.rightNaviButton setTitle:title forState:UIControlStateHighlighted];
    [self.rightNaviButton setTitleColor:color forState:UIControlStateNormal];
    [self.rightNaviButton setTitleColor:highlightcolor forState:UIControlStateHighlighted];
    self.rightNaviButton.titleLabel.font = [UIFont systemFontOfSize:15];
    self.rightNaviButton.frame = CGRectMake(self.topBar.h_width - HNavTitleButtonWidth - HNavTitleButtonMargin, self.rightNaviButton.h_y, HNavTitleButtonWidth, self.rightNaviButton.h_height);
}

#pragma mark - 状态栏的隐藏控制
//iOS7必须覆盖该方法并返回YES才能控制状态栏隐藏
- (BOOL)prefersStatusBarHidden {
    return NO;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}

- (BOOL)prefersTopBarLineHidden {
    return NO;
}

#pragma mark - 导航栏状态控制

- (void)setNeedsNavigationBarAppearanceUpdate {
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    self.topBar.hidden = [self prefersNavigationBarHidden];
    self.topBar.backgroundColor = [self preferredNaviBarColor];
    self.topBarLine.backgroundColor = [self preferredNaviShadowColor];
}

- (BOOL)prefersNavigationBarHidden {
    return NO;
}

- (UIColor *)preferredNaviBarColor {
    return [HViewController appearance].barColor;
}

- (UIColor *)preferredNaviShadowColor {
    return [UIColor clearColor];
//    return [HSkinManager lineColor];
}

#pragma mark - 旋转支持
- (BOOL)shouldAutorotate {
    //return YES;
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskAll;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {
    return UIInterfaceOrientationPortrait;
}


//#pragma mark - gestureRecognizer delegate
//
//- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRequireFailureOfGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
//{
//    [otherGestureRecognizer requireGestureRecognizerToFail:gestureRecognizer];
//    return NO;
//}

#pragma mark - 请求控制
- (NSMutableArray *)controllableRequests {
    if (!_controllableRequests) {
        _controllableRequests = [NSMutableArray new];
    }
    return _controllableRequests;
}
//- (void)controlRequest:(HNetworkDAO *)request {
//    if ([request isKindOfClass:[HNetworkDAO class]]) {
//        [self.controllableRequests addObject:request];
//    }
//}

- (void)refresh {
    
}
//需要释放内存
- (void)needReleaseMemory {
    
}
- (BOOL)popGestureEnabled {
    return YES;
}

@end
