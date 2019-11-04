//
//  UIScreen+HUtil.m
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import "UIScreen+HUtil.h"

@implementation UIScreen (HUtil)

+ (CGRect)bounds {
    return [UIScreen mainScreen].bounds;
}

+ (CGSize)size {
    return [UIScreen mainScreen].bounds.size;
}

+ (CGFloat)height {
    return [UIScreen mainScreen].bounds.size.height;
}

+ (CGFloat)width {
    return [UIScreen mainScreen].bounds.size.width;
}

+ (CGFloat)onePixel {
    UIScreen *mainScreen = [UIScreen mainScreen];
    if ([mainScreen respondsToSelector:@selector(nativeScale)]) {
        return 1.0f / mainScreen.nativeScale;
    }else {
        return 1.0f / mainScreen.scale;
    }
}

@end
