//
//  UIApplication+HUtil.h
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"

typedef NS_ENUM(NSInteger, YPNetworkStatus) {
    YPNetworkStatusUnknown          = -1,
    YPNetworkStatusNotReachable     = 0,
    YPNetworkStatusReachableVia2G   = 1,
    YPNetworkStatusReachableVia3G   = 2,
    YPNetworkStatusReachableVia4G   = 3,
    YPNetworkStatusReachableViaLTE  = 4,
    YPNetworkStatusReachableViaWiFi = 5,
};

@interface UIApplication (HUtil)

//AppDelegate
+ (AppDelegate *_Nonnull)appDel;

//get Window 0
+ (UIWindow *_Nonnull)getKeyWindow;

//get Window 0
- (UIWindow *_Nonnull)getKeyWindow;

//get root VC of window 0
+ (UIViewController *_Nullable)getKeyWindowRootController;

//get root VC of window 0
- (UIViewController *_Nullable)getKeyWindowRootController;

//设备是否横屏
+ (BOOL)horizontalScreen;

//get root navigation controller
+ (UINavigationController *_Nullable)navi;

//get root navigation controller top
+ (UIViewController *_Nullable)naviTop;

//get root tabbar vc
+ (UITabBarController *_Nullable)tabbarVC;

/**
 *  Bundle Name
 */
+ (nullable NSString *)appBundleName;

/**
 *  Bundle Display Name
 */
+ (nullable NSString *)appBundleDisplayName;

/**
 *  Bundle ID
 */
+ (nullable NSString *)appBundleID;

/**
 *  版本名称，例如：1.2.0
 */
+ (nullable NSString *)appVersionName;

/**
 *  版本号，例如：123
 */
+ (nullable NSString *)appShortVersionString;

/**
 *  app启动图
 */
+ (UIImage *_Nullable)appLaunchImage;

/**
 *  根据app状态栏获取网络状态
 */
+ (YPNetworkStatus)networkStatusFromStateBar;

/**
 *  判断程序是否为从AppStore安装
 */
+ (BOOL)isPirated;

/**
 *  是否为调试模式
 */
+ (BOOL)isBeingDebugged;

+ (void)hideKeyboard;

+ (void)call:(NSString *_Nullable)phone;

+ (void)openURLString:(NSString *_Nullable)URLString;

@end
