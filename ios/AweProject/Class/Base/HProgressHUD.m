//
//  HProgressHUD.m
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/25.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "HProgressHUD.h"

#define KTime 60*60*24

@implementation HProgressHUD

+ (void)showWithStatus:(NSString*)status {
    [SVProgressHUD dismiss];
    [SVProgressHUD showWithStatus:status];
    [SVProgressHUD dismissWithDelay:1.0];
}

+ (void)showWithStatus:(NSString*)status delay:(NSTimeInterval)interval {
    [SVProgressHUD dismiss];
    [SVProgressHUD setMinimumDismissTimeInterval:KTime];
    [SVProgressHUD showWithStatus:status];
    [SVProgressHUD dismissWithDelay:interval];
}

+ (void)showLoadingWithStatus:(NSString*)status {
    [SVProgressHUD dismiss];
    [SVProgressHUD showWithStatus:status];
    [SVProgressHUD dismissWithDelay:KTime];
}

+ (void)showInfoWithStatus:(NSString*)status {
    [SVProgressHUD dismiss];
    [SVProgressHUD showInfoWithStatus:status];
    [SVProgressHUD dismissWithDelay:1.0];
}

+ (void)showInfoWithStatus:(NSString*)status delay:(NSTimeInterval)interval {
    [SVProgressHUD dismiss];
    [SVProgressHUD setMinimumDismissTimeInterval:KTime];
    [SVProgressHUD showInfoWithStatus:status];
    [SVProgressHUD dismissWithDelay:interval];
}

+ (void)showSuccessWithStatus:(NSString*)status {
    [SVProgressHUD dismiss];
    [SVProgressHUD showSuccessWithStatus:status];
    [SVProgressHUD dismissWithDelay:1.0];
}

+ (void)showSuccessWithStatus:(NSString*)status delay:(NSTimeInterval)interval{
    [SVProgressHUD dismiss];
    [SVProgressHUD setMinimumDismissTimeInterval:KTime];
    [SVProgressHUD showSuccessWithStatus:status];
    [SVProgressHUD dismissWithDelay:interval];
}

+ (void)showErrorWithStatus:(NSString*)status {
    [SVProgressHUD dismiss];
    [SVProgressHUD showErrorWithStatus:status];
    [SVProgressHUD dismissWithDelay:1.0];
}

+ (void)showErrorWithStatus:(NSString*)status delay:(NSTimeInterval)interval {
    [SVProgressHUD dismiss];
    [SVProgressHUD setMinimumDismissTimeInterval:KTime];
    [SVProgressHUD showErrorWithStatus:status];
    [SVProgressHUD dismissWithDelay:interval];
}

+ (void)dismiss {
    [SVProgressHUD dismiss];
}

@end
