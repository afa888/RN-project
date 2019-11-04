//
//  UIGestureRecognizer+HUtil.m
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import "UIGestureRecognizer+HUtil.h"
#import <objc/runtime.h>

static const int gesture_block_key;

@interface UIGestureRecognizerBlockTarget : NSObject

@property (nonatomic, copy) void (^block)(id sender);

- (id)initWithBlock:(void (^)(id sender))block;
- (void)invoke:(id)sender;

@end

@implementation UIGestureRecognizerBlockTarget

- (id)initWithBlock:(void (^)(id sender))block{
    self = [super init];
    if (self) {
        self.block = block;
    }
    return self;
}

- (void)invoke:(id)sender {
    if (self.block) {
        self.block(sender);
    }
}

@end


@implementation UIGestureRecognizer (HUtil)

- (instancetype)initWithActionBlock:(void (^)(id sender))block {
    self = [self init];
    [self addActionBlock:block];
    return self;
}

- (void)addActionBlock:(void (^)(id sender))block {
    UIGestureRecognizerBlockTarget *target = [[UIGestureRecognizerBlockTarget alloc] initWithBlock:block];
    [self addTarget:target action:@selector(invoke:)];
    NSMutableArray *targets = [self allGestureRecognizerBlockTargets];
    [targets addObject:target];
}

- (void)removeAllActionBlocks {
    NSMutableArray *targets = [self allGestureRecognizerBlockTargets];
    [targets enumerateObjectsUsingBlock:^(id target, NSUInteger idx, BOOL *stop) {
        [self removeTarget:target action:@selector(invoke:)];
    }];
    [targets removeAllObjects];
}

- (NSMutableArray *)allGestureRecognizerBlockTargets {
    NSMutableArray *targets = objc_getAssociatedObject(self, &gesture_block_key);
    if (!targets) {
        targets = [NSMutableArray array];
        objc_setAssociatedObject(self, &gesture_block_key, targets, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return targets;
}

@end
