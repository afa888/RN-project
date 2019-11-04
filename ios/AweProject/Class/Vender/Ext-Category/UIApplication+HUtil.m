
//
//  UIApplication+HUtil.m
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import "UIApplication+HUtil.h"
#import "UIDevice+HUtil.h"
#import <sys/sysctl.h>

@implementation UIApplication (HUtil)

+ (AppDelegate *)appDel {
    return (AppDelegate *)[UIApplication sharedApplication].delegate;
}

+ (UIWindow *)getKeyWindow {
    return [[UIApplication sharedApplication] getKeyWindow];
}
- (UIWindow *)getKeyWindow {
//    UIWindow *window = self.windows[0];
    UIWindow *window = self.keyWindow;
    return window;
}

+ (UIViewController *)getKeyWindowRootController {
    return [[UIApplication sharedApplication] getKeyWindowRootController];
}
- (UIViewController *)getKeyWindowRootController {
    UIWindow *keyWindow = [self getKeyWindow];
    return keyWindow.rootViewController;
}

//设备是否横屏
+ (BOOL)horizontalScreen {
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    if ((orientation == UIDeviceOrientationPortrait) || (orientation == UIDeviceOrientationPortraitUpsideDown)) {
        return NO;
    }else if ((orientation == UIDeviceOrientationLandscapeLeft) || (orientation == UIDeviceOrientationLandscapeRight)) {
        return YES;
    }
    return NO;
}

//get root navigation controller
+ (UINavigationController *)navi {
    UIViewController *navi = [self getKeyWindowRootController];
    if ([navi isKindOfClass:[UINavigationController class]]) {
        return (UINavigationController *)navi;
    }
    else return nil;
}

//get root navigation controller top
+ (UIViewController *)naviTop {
    UIViewController *navi = [self getKeyWindowRootController];
    if ([navi isKindOfClass:[UINavigationController class]]) {
        return [(UINavigationController *)navi topViewController];
    }
    else return nil;
}

//get root tabbar vc
+ (UITabBarController *)tabbarVC {
    UIViewController *tabVC = [self getKeyWindowRootController];
    if ([tabVC isKindOfClass:[UITabBarController class]]) {
        return (UITabBarController *)tabVC;
    }
    else return nil;
}

+ (NSString *)appBundleName {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"];
}

+ (NSString *)appBundleDisplayName {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"];
}

+ (NSString *)appBundleID {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"];
}

+ (NSString *)appVersionName {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"];
}

+ (NSString *)appShortVersionString {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
}

+ (UIImage *)appLaunchImage {
    NSString *viewOrientation = @"Portrait";
    if (UIInterfaceOrientationIsLandscape([[UIApplication sharedApplication] statusBarOrientation])) {
        viewOrientation = @"Landscape";
    }
    NSString *launchImageName = nil;
    NSArray* imagesDict = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"UILaunchImages"];
    
    CGSize viewSize = [UIScreen mainScreen].bounds.size;
    for (NSDictionary* dict in imagesDict) {
        CGSize imageSize = CGSizeFromString(dict[@"UILaunchImageSize"]);
        if (CGSizeEqualToSize(imageSize, viewSize) && [viewOrientation isEqualToString:dict[@"UILaunchImageOrientation"]]) {
            launchImageName = dict[@"UILaunchImageName"];
        }
    }
    return [UIImage imageNamed:launchImageName];
}

+ (YPNetworkStatus)networkStatusFromStateBar {
    // 状态栏是由当前app控制的，首先获取当前app
    UIApplication *app = [UIApplication sharedApplication];
    NSArray *children = [[[app valueForKeyPath:@"statusBar"] valueForKeyPath:@"foregroundView"] subviews];
    
    for (id child in children) {
        if ([child isKindOfClass:[NSClassFromString(@"UIStatusBarDataNetworkItemView") class]]) {
            return [[child valueForKeyPath:@"dataNetworkType"] integerValue];
        }
    }
    return YPNetworkStatusUnknown;
}

+ (BOOL)isPirated {
    if ([[UIDevice currentDevice] isSimulator]) return YES; // Simulator is not from appstore
    
    if (getgid() <= 10) return YES; // process ID shouldn't be root
    
    if ([[[NSBundle mainBundle] infoDictionary] objectForKey:@"SignerIdentity"]) {
        return YES;
    }
    
    if (![self fileExistInMainBundle:@"_CodeSignature"]) {
        return YES;
    }
    
    if (![self fileExistInMainBundle:@"SC_Info"]) {
        return YES;
    }
    
    return NO;
}

+ (BOOL)fileExistInMainBundle:(NSString *)name {
    NSString *bundlePath = [[NSBundle mainBundle] bundlePath];
    NSString *path = [NSString stringWithFormat:@"%@/%@", bundlePath, name];
    return [[NSFileManager defaultManager] fileExistsAtPath:path];
}

+ (BOOL)isBeingDebugged {
    size_t size = sizeof(struct kinfo_proc);
    struct kinfo_proc info;
    int ret = 0, name[4];
    memset(&info, 0, sizeof(struct kinfo_proc));
    
    name[0] = CTL_KERN;
    name[1] = KERN_PROC;
    name[2] = KERN_PROC_PID; name[3] = getpid();
    
    if (ret == (sysctl(name, 4, &info, &size, NULL, 0))) {
        return ret != 0;
    }
    return (info.kp_proc.p_flag & P_TRACED) ? YES : NO;
}

+ (void)hideKeyboard {
    [[[UIApplication sharedApplication] keyWindow] endEditing:YES];
}

+ (void)call:(NSString *)phone {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@", phone]]];
#pragma clang diagnostic pop
}


//是否含有中文，YES：有中文；NO：没有中文
+ (BOOL)checkIsChinese:(NSString *)string {
    for (int i=0; i<string.length; i++) {
        unichar ch = [string characterAtIndex:i];
        if (0x4E00 <= ch  && ch <= 0x9FA5) {
            return YES;
        }
    }
    return NO;
}

@end
