//
//  UIScreen+HUtil.h
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import <UIKit/UIKit.h>

// 一个像素的宽度
#define ONE_PIXEL [UIScreen onePixel]

@interface UIScreen (HUtil)

+ (CGRect)bounds;
+ (CGSize)size;
+ (CGFloat)height;
+ (CGFloat)width;
+ (CGFloat)onePixel;

@end
