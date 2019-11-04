//
//  HGameViewController.m
//  HProjectModel1
//
//  Created by txkj_jordan on 2019/4/10.
//  Copyright © 2019年 dqf. All rights reserved.
//

#import "HGameViewController.h"
#import "Masonry.h"
#import "HSFSafariViewController.h"
#import "HProgressHUD.h"
#import "HSkinManager.h"

@interface HGameViewController () <SFSafariViewControllerDelegate>

@property (nonatomic, strong) UIView *gameContentView;
/**
 需要迷你型navBar(同时statusBar需要隐藏)的游戏类型数组 -> 有的游戏能全屏显示 能划掉‘全屏显示’的蒙层
 */
@property (nonatomic, strong) NSArray *miniNavbarGameTypeArr;

@property (nonatomic ,strong) HSFSafariViewController *sfsafarViewController;
@property (nonatomic ,strong) NSURL *gameURL;
@end

@implementation HGameViewController

- (instancetype)initWithURL:(NSURL *)url{
  if([super init]){
    self.gameURL = url;
  }
  return self;
}
- (UIView *)gameContentView{
  if(_gameContentView == nil){
    _gameContentView =  [UIView new];
    _gameContentView.backgroundColor = [UIColor clearColor];
  }
  return _gameContentView;
}


- (void)back{
  //移除子视图
  [self.sfsafarViewController willMoveToParentViewController:nil];
  [self.sfsafarViewController removeFromParentViewController];
  [self.sfsafarViewController.view removeFromSuperview];
  [super back];
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  [AppDelegate setShouldAutorotate:YES];
}

- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];
  [AppDelegate setShouldAutorotate:NO];
}
- (void)game_viewDidLoad{
  [self.view insertSubview:self.gameContentView atIndex:0];
  [self.gameContentView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(self.view);
  }];
  self.sfsafarViewController.delegate = self;
  self.sfsafarViewController.preferredBarTintColor = [UIColor whiteColor];
  //    self.sfsafarViewController.preferredControlTintColor = [HSkinManager progressColor];
  [self addChildViewController:self.sfsafarViewController];
  [self.sfsafarViewController didMoveToParentViewController:self];
  
  [self.gameContentView addSubview:self.sfsafarViewController.view];
  [self.sfsafarViewController.view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(self.gameContentView);
  }];
}
- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.navigationController.navigationBarHidden = YES;
  [self.view setBackgroundColor:[HSkinManager vcBgViewColor]];
  [self.topBar setBackgroundColor:[HSkinManager naviBarColor]];
  [self setLeftNaviImage:[UIImage imageNamed:@"top_Back_nor"]];
  [self.titleLabel setText:@"游戏"];
  
  if (![UIDevice currentDevice].generatesDeviceOrientationNotifications) {
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
  }
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleDeviceOrientationChange:)
                                               name:UIDeviceOrientationDidChangeNotification
                                             object:nil];
  [HProgressHUD showLoadingWithStatus:@"加载中..."];
}

#pragma mark - SFSafariViewControllerDelegate
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller {
  [UIApplication sharedApplication].statusBarHidden = NO;
  [controller dismissViewControllerAnimated:YES completion:^{
    
  }];
}

- (void)safariViewController:(SFSafariViewController *)controller didCompleteInitialLoad:(BOOL)didLoadSuccessfully {
  [HProgressHUD dismiss];
  
  if ([self.gameType isEqualToString:@"ESW"]) {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [self setNewOrientation:YES];
    });
    
  }
}

- (HSFSafariViewController *)sfsafarViewController{
  if(_sfsafarViewController == nil){
    _sfsafarViewController = [[HSFSafariViewController alloc] initWithURL:self.gameURL];
  }
  return _sfsafarViewController;
}

#pragma mark - notification method
- (void)handleDeviceOrientationChange:(NSNotification *)notification {
  UIDeviceOrientation deviceOrientation = [UIDevice currentDevice].orientation;
  switch (deviceOrientation) {
    case UIDeviceOrientationLandscapeLeft:
    case UIDeviceOrientationLandscapeRight: {
      self.topBar.hidden = YES;
      [self.gameContentView mas_updateConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.view.mas_top).offset(-44);
        make.bottom.equalTo(self.view.mas_bottom).offset(44);
      }];
    }
      break;
    case UIDeviceOrientationPortrait: {
      self.topBar.hidden = NO;
      [self.gameContentView mas_updateConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.view.mas_top).offset(0);
        make.bottom.equalTo(self.view.mas_bottom).offset(0);
      }];
    }
      break;
    default:
      break;
  }
}

- (void)viewWillLayoutSubviews {
  [super viewWillLayoutSubviews];
  [self game_viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
}

#pragma mark - over load
- (BOOL)shouldAutorotate {
  return YES;
}
#pragma mark - lazy load
//2.0 下架了
- (NSArray *)miniNavbarGameTypeArr {
  if (!_miniNavbarGameTypeArr) {
    _miniNavbarGameTypeArr = @[@"PT"];
  }
  return _miniNavbarGameTypeArr;
}

#pragma mark - private method
/**
 强制横竖屏切换
 
 @param fullscreen 是否全屏（横屏时 即为全屏）
 */
- (void)setNewOrientation:(BOOL)fullscreen{
  if (fullscreen) {
    NSNumber *resetOrientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationUnknown];
    [[UIDevice currentDevice] setValue:resetOrientationTarget forKey:@"orientation"];
    NSNumber *orientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight];
    [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
  }else{
    NSNumber *resetOrientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationUnknown];
    [[UIDevice currentDevice] setValue:resetOrientationTarget forKey:@"orientation"];
    NSNumber *orientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationPortrait];
    [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
  }
}

@end
