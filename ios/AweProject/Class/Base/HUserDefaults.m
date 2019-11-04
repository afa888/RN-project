//
//  HUserDefaults.m
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/27.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import "HUserDefaults.h"

#define KUSER @"H_USER_DEFAULTS"
static HUserDefaults *share = nil;

@implementation HUserDefaults


+ (HUserDefaults *)defaults {
  static dispatch_once_t predicate;
  dispatch_once(&predicate, ^{
    NSData *data = [[NSUserDefaults standardUserDefaults] objectForKey:KUSER];
    if (data) {
      share = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    }else {
      share = HUserDefaults.new;
    }
  });
  return share;
}

- (NSString *)baseLink {
  return [[NSUserDefaults standardUserDefaults] objectForKey:@"baseLink"];
}
- (void)setBaseLink:(NSString *)baseLink {
    [[NSUserDefaults standardUserDefaults] setObject:baseLink forKey:@"baseLink"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)setH5Link:(NSString *)h5Link {
    [[NSUserDefaults standardUserDefaults] setObject:h5Link forKey:@"h5Link"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}
- (NSString *)h5Link {
    return [[NSUserDefaults standardUserDefaults] objectForKey:@"h5Link"];
}

- (void)setPlatCodeLink:(NSString *)platCodeLink {
    [[NSUserDefaults standardUserDefaults] setObject:platCodeLink forKey:@"platCodeLink"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}
- (NSString *)platCodeLink {
    return [[NSUserDefaults standardUserDefaults] objectForKey:@"platCodeLink"];
}


- (void)setSrc1Link:(NSString *)src1Link {
    [[NSUserDefaults standardUserDefaults] setObject:src1Link forKey:@"src1Link"];
    [[NSUserDefaults standardUserDefaults] synchronize];
}
- (NSString *)src1Link {
    return [[NSUserDefaults standardUserDefaults] objectForKey:@"src1Link"];
}

@end
