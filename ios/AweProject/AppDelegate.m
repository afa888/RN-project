/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import "HNavigationController.h"
#import "GQKeyboardManager.h"
#import <React/RCTNetworking.h>

@interface NSURLRequest (AllowAnyHTTPSCertificate)
@end

@implementation NSURLRequest (AllowAnyHTTPSCertificate)

+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
{
  return YES;
}

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  GQKeyboardManager *gqkb = [GQKeyboardManager share];
  gqkb.enable = YES;
  gqkb.enableAutoToolbar = YES;
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"AweProject"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  
  
  HNavigationController *navCon = [[HNavigationController alloc] initWithRootViewController:rootViewController];
  navCon.navigationBarHidden = YES;
  
  self.window.rootViewController = navCon;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
  if (self.allowRotate) {
    return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight;
  }
  return UIInterfaceOrientationMaskPortrait;
}

@end
