//
//  HUserDefaults.h
//  HProjectModel1
//
//  Created by txkj_mac on 2018/9/27.
//  Copyright © 2018年 dqf. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface HUserDefaults : NSObject

+ (HUserDefaults *)defaults;
//线上环境链接
- (void)setBaseLink:(NSString *)baseLink;
- (NSString *)baseLink;

- (void)setH5Link:(NSString *)h5Link;
- (NSString *)h5Link;

- (void)setPlatCodeLink:(NSString *)platCodeLink;
- (NSString *)platCodeLink;

- (void)setSrc1Link:(NSString *)src1Link;
- (NSString *)src1Link;


@end
