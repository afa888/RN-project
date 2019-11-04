//
//  HSkinManager.m
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/19.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "HSkinManager.h"

@implementation HSkinManager

+ (UIColor *)naviBarColor {
    return [UIColor colorWithString:@"#FFFFFF"];
}

+ (UIColor *)naviTitleColor {
    return [UIColor colorWithString:@"#000000"];
}

+ (UIColor *)naviRightButtonTitleColor {
    return [UIColor colorWithString:@"#FFFFFF"];
}

+ (UIColor *)vcBgViewColor {
    return [UIColor colorWithString:@"#3C428C"];
}

+ (NSString *)vcBgViewClrString {
    return @"#3C428C";
}

+ (UIColor *)leftSideBgColor {
    return [UIColor colorWithString:@"#17171B"];
}

+ (UIColor *)tabBarBgColor {
    return [UIColor colorWithString:@"#2E346A"];
}

+ (UIColor *)sectionBgColor {
    return [self specialColor3];
//    return [UIColor colorWithString:@"#FFFFFF"];
}

+ (UIColor *)textColor {
    return [UIColor whiteColor];
}

+ (NSString *)textClsString {
    return @"#FFFFFF";
}

+ (UIColor *)textGrayWhiteColor {
    return [UIColor colorWithString:@"#8B8B8B"];
}

+ (UIColor *)specialColor2 {
    return [UIColor colorWithString:@"#FFDC92"];
}

//button 文字颜色
+ (UIColor *)specialColor3 {
    return [self tabBarBgColor];
}

+ (UIColor *)specialColor4 {
    return [UIColor colorWithString:@"#BABEC7"];
}

+ (UIColor *)specialColor5 {
    return [UIColor colorWithString:@"#464E93"];
}

+ (UIColor *)specialColor {
    return [UIColor colorWithString:@"#D62F27"];
}

+ (UIColor *)lineColor {
    return [UIColor colorWithString:@"#B7B7B7"];
}

+ (UIColor *)specialLineColor {
    return [UIColor colorWithString:@"#3B342E"];
}

+ (UIColor *)inputBgColor {
    return [UIColor colorWithString:@"#F9FFB0"];
}

+ (UIColor *)commonTextColor {
   return [UIColor colorWithString:@"#FFCB89"];
}
@end
