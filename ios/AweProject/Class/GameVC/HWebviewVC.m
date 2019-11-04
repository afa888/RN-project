//
//  HWebviewVC.m
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/22.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "HWebviewVC.h"
#import <WebKit/WebKit.h>

#import "DKProgressLayer.h"
#import "UIWebView+DKProgress.h"
#import "HSkinManager.h"
#import "HProgressHUD.h"
#import "HNavigationController.h"
#import "UIApplication+HUtil.h"

@interface HWebviewVC () <UIWebViewDelegate>
@property (nonatomic) UIWebView *webview;
@property (nonatomic) NSInteger topHeight;

@end

@implementation HWebviewVC

- (UIWebView *)webview {
    if (!_webview) {
        CGRect frame = self.view.frame;
        frame.origin.y += kTopBarHeight;
        frame.size.height -= kTopBarHeight;
        _webview = [[UIWebView alloc] initWithFrame:frame];
        _webview.backgroundColor = [HSkinManager vcBgViewColor];
        [_webview setScalesPageToFit:YES];
        [_webview setDelegate:self];
    }
    return _webview;
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [HProgressHUD dismiss];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    if (self.gameType) {
        [(HNavigationController *)UIApplication.navi removeFromFullScreenPopBlackList:self];
    }
    [AppDelegate setShouldAutorotate:NO];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [self.view setBackgroundColor:[HSkinManager vcBgViewColor]];
    [self.topBar setBackgroundColor:[HSkinManager naviBarColor]];
    [self setLeftNaviImage:[UIImage imageNamed:@"top_Back_nor"]];
    [self.titleLabel setText:self.titleText];
    self.topHeight = kTopBarHeight;

    if (self.gameType) {
        [(HNavigationController *)UIApplication.navi addFullScreenPopBlackListItem:self];
    }
    
    if ([self.gameType isEqualToString:@"BBIN"]) {
                
        self.webview.dk_progressLayer = [[DKProgressLayer alloc] initWithFrame:CGRectMake(0, 0.f, SCREEN_WIDTH, 2.f)];
        self.webview.dk_progressLayer.progressColor = [UIColor blueColor];
        self.webview.dk_progressLayer.progressStyle = DKProgressStyle_Noraml;
        
        [self.webview.layer addSublayer:self.webview.dk_progressLayer];
        
        if (![UIDevice currentDevice].generatesDeviceOrientationNotifications) {
            [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
        }
        [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(handleDeviceOrientationChange:)
                                                    name:UIDeviceOrientationDidChangeNotification object:nil];
    }
    
    [HProgressHUD showLoadingWithStatus:@"加载中..."];
    
    if(self.htmlFile.length > 0){
        NSString *basePath = [[NSBundle mainBundle] bundlePath];
        NSURL *baseUrl = [NSURL fileURLWithPath:basePath isDirectory: YES];
        NSString *indexPath = [NSString stringWithFormat:@"%@/%@", basePath,self.htmlFile];
        NSString *indexContent = [NSString stringWithContentsOfFile:indexPath encoding:NSUTF8StringEncoding error:nil];
        [self.webview loadHTMLString:indexContent baseURL: baseUrl];
    }else if (self.htmlurl.length > 0) {
        self.webview.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:self.htmlurl]];
        [self.webview loadRequest:request];
    }

}

- (void)viewWillLayoutSubviews {
    [super viewWillLayoutSubviews];
    CGRect frame = self.view.frame;
    frame.origin.y += self.topHeight;
    frame.size.height -= self.topHeight;
    [self.webview setFrame:frame];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    // 为’红包活动‘时 禁止选择/复制等操作
    if ([self.titleText containsString:@"红包"]) {
        // Disable user selection
        [webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.style.webkitUserSelect='none';"];
        // Disable callout
        [webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.style.webkitTouchCallout='none';"];
    }
    //改变字体大小
//    [webView stringByEvaluatingJavaScriptFromString:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '330%'"];

    //去掉页面标题
    if (self.htmlurl.length > 0) {
        //根据标签类型获取指定标签的元素
        NSMutableString *str = [NSMutableString string];
        [str appendString:@"var header = document.getElementsByClassName(\"TopHeader\")[0];"];
        //移除头部的导航栏
        [str appendString:@"header.style.display = 'none';"];
        [webView stringByEvaluatingJavaScriptFromString:str];
        
        //解决界面卡顿的问题
        str = [NSMutableString string];
        [str appendString:@"document.getElementsByClassName(\"publicpage\")[0].style.cssText += '-webkit-overflow-scrolling:touch'"];
        [webView stringByEvaluatingJavaScriptFromString:str];
        
    }else {
        //改变背景颜色
        NSString *bgColorString = [NSString stringWithFormat:@"document.body.style.backgroundColor = '%@'", [HSkinManager vcBgViewClrString]];
        [webView stringByEvaluatingJavaScriptFromString:bgColorString];
        //改变字体颜色
        NSString *textColorString = [NSString stringWithFormat:@"document.getElementsByTagName('body')[0].style.webkitTextFillColor= '%@'", [HSkinManager textClsString]];
        [webView stringByEvaluatingJavaScriptFromString:textColorString];
    }
    
    if (![self.view.subviews containsObject:self.webview]) {
        [self.view addSubview:self.webview];
        [HProgressHUD dismiss];
    }
}

#pragma mark - notification method
- (void)handleDeviceOrientationChange:(NSNotification *)notification {
    UIDeviceOrientation deviceOrientation = [UIDevice currentDevice].orientation;
    switch (deviceOrientation) {
        case UIDeviceOrientationLandscapeLeft:
        case UIDeviceOrientationLandscapeRight:
        {
            self.topBar.hidden = YES;
            self.topHeight = 0;
            [self.webview setFrame:self.view.frame];
        }
            break;
        case UIDeviceOrientationPortrait:
        {
            self.topHeight = kTopBarHeight;
            self.topBar.hidden = NO;
            
            CGRect frame = self.view.frame;
            frame.origin.y += self.topHeight;
            frame.size.height -= self.topHeight;
            [self.webview setFrame:frame];
        }
            break;
        default:
            break;
    }
}

#pragma mark - over load
- (BOOL)shouldAutorotate {
    return [self.gameType isEqualToString:@"BBIN"];
}

@end
