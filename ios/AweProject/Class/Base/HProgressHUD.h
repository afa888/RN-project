//
//  HProgressHUD.h
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/25.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "SVProgressHUD.h"

@interface HProgressHUD : SVProgressHUD

+ (void)showWithStatus:(NSString*)status;

+ (void)showWithStatus:(NSString*)status delay:(NSTimeInterval)interval;

+ (void)showLoadingWithStatus:(NSString*)status;

+ (void)showInfoWithStatus:(NSString*)status;

+ (void)showInfoWithStatus:(NSString*)status delay:(NSTimeInterval)interval;

+ (void)showSuccessWithStatus:(NSString*)status;

+ (void)showSuccessWithStatus:(NSString*)status delay:(NSTimeInterval)interval;

+ (void)showErrorWithStatus:(NSString*)status;

+ (void)showErrorWithStatus:(NSString*)status delay:(NSTimeInterval)interval;

+ (void)dismiss;

@end
