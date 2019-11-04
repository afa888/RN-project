//
//  NSObject+HSwizzleUtil.m
//  TestProject
//
//  Created by dqf on 2017/9/28.
//  Copyright © 2017年 dqfStudio. All rights reserved.
//

#import "NSObject+HSwizzleUtil.h"

@implementation NSObject (HSwizzleUtil)
+ (void)methodSwizzleWithOrigSEL:(SEL)origSEL overrideSEL:(SEL)overrideSEL {
    Method origMethod = class_getInstanceMethod([self class], origSEL);
    Method overrideMethod= class_getInstanceMethod([self class], overrideSEL);
    if(class_addMethod([self class], origSEL,
                       method_getImplementation(overrideMethod),
                       method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod([self class],overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    }else {
        method_exchangeImplementations(origMethod,overrideMethod);
    }
}
+ (void)classMethodSwizzleWithOrigSEL:(SEL)origSEL overrideSEL:(SEL)overrideSEL {
    Method origMethod = class_getClassMethod(self, origSEL);
    Method overrideMethod= class_getClassMethod(self, overrideSEL);
    Class metaClass = object_getClass(self);
    if(class_addMethod(metaClass, origSEL,
                       method_getImplementation(overrideMethod),
                       method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(metaClass,overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    }else {
        method_exchangeImplementations(origMethod,overrideMethod);
    }
}
@end
