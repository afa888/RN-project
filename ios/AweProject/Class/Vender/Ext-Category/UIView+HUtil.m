//
//  UIView+HUtil.m
//  MeTa
//
//  Created by dqf on 2017/8/29.
//  Copyright © 2017年 hisun. All rights reserved.
//

#import "UIView+HUtil.h"

#define TIPS_IMAGE_VIEW_TAG 10000
#define TIPS_LABEL_TAG 10001

static const void *userInfoAddress = &userInfoAddress;

@implementation UIView (HUtil)

#pragma mark - Init

+ (instancetype)viewWithNibName:(NSString *)name {
    return [[[NSBundle mainBundle] loadNibNamed:name owner:nil options:nil] firstObject];
}

+ (instancetype)viewFromNib {
    return [[[NSBundle mainBundle] loadNibNamed:NSStringFromClass(self) owner:nil options:nil] firstObject];
}

#pragma mark - Frame

- (CGFloat)h_x {
    return self.frame.origin.x;
}
- (void)setH_x:(CGFloat)h_x {
    CGRect frame = self.frame;
    frame.origin.x = h_x;
    self.frame = frame;
}

- (CGFloat)h_y {
    return self.frame.origin.y;
}
- (void)setH_y:(CGFloat)h_y {
    CGRect frame = self.frame;
    frame.origin.y = h_y;
    self.frame = frame;
}

- (CGFloat)h_width {
    return self.frame.size.width;
}
- (void)setH_width:(CGFloat)h_width {
    CGRect frame = self.frame;
    frame.size.width = h_width;
    self.frame = frame;
}

- (CGFloat)h_height {
    return self.frame.size.height;
}
- (void)setH_height:(CGFloat)h_height {
    CGRect frame = self.frame;
    frame.size.height = h_height;
    self.frame = frame;
}






- (CGPoint)h_origin {
    return self.frame.origin;
}
- (void)setH_origin:(CGPoint)h_origin {
    CGRect frame = self.frame;
    frame.origin = h_origin;
    self.frame = frame;
}

- (CGSize)h_size {
    return self.frame.size;
}
- (void)setH_size:(CGSize)h_size {
    CGRect frame = self.frame;
    frame.size = h_size;
    self.frame = frame;
}

- (CGFloat)h_centerX {
    return self.center.x;
}
- (void)setH_centerX:(CGFloat)h_centerX {
    self.center = CGPointMake(h_centerX, self.center.y);
}

- (CGFloat)h_centerY {
    return self.center.y;
}
- (void)setH_centerY:(CGFloat)h_centerY {
    self.center = CGPointMake(self.center.x, h_centerY);
}

- (CGFloat)h_minX {
    return CGRectGetMinX(self.frame);
}
- (CGFloat)h_minY {
    return CGRectGetMinY(self.frame);
}

- (CGFloat)h_midX {
    return CGRectGetMidX(self.frame);
}
- (CGFloat)h_midY {
    return CGRectGetMidY(self.frame);
}

- (CGFloat)h_maxX {
    return CGRectGetMaxX(self.frame);
}
- (CGFloat)h_maxY {
    return CGRectGetMaxY(self.frame);
}

- (void)fitScreenWidth {
    [self setH_width:[UIScreen width]];
}

- (void)fitScreenHeight {
    [self setH_height:[UIScreen height]];
}

- (void)fitSuperX {
    [self setH_x:self.superview.h_minX];
}

- (void)fitSuperY {
    [self setH_y:self.superview.h_minY];
}

- (void)fitSuperOrigin {
    [self fitSuperX];
    [self fitSuperY];
}

- (void)fitSuperWidth {
    [self setH_width:self.superview.h_width];
}

- (void)fitSuperHeight {
    [self setH_height:self.superview.h_height];
}

- (void)fitSuperSize {
    [self fitSuperWidth];
    [self fitSuperHeight];
}

- (void)fitSuperFrame {
    [self setFrame:self.superview.frame];
}





- (void)horizontalCenterWithWidth:(CGFloat)width {
    self.h_x = ceilf((width - self.h_width) / 2);
}

- (void)verticalCenterWithHeight:(CGFloat)height {
    self.h_y = ceilf((height - self.h_height) / 2);
}

- (void)verticalCenterInSuperView {
    [self verticalCenterWithHeight:self.superview.h_height];
}

- (void)horizontalCenterInSuperView {
    [self horizontalCenterWithWidth:self.superview.h_width];
}

#pragma mark - Tap Gesture

//- (UITapGestureRecognizer *)setSingleTapGestureWithBlock:(void (^)(UITapGestureRecognizer *))block {
//    return [self addTapGestureWithNumberOfTapsRequired:1 block:block];
//}

- (UITapGestureRecognizer *)addDoubleTapGestureWithBlock:(void (^)(UITapGestureRecognizer *))block {
    return [self addTapGestureWithNumberOfTapsRequired:2 block:block];
}

- (UITapGestureRecognizer *)addTapGestureWithNumberOfTapsRequired:(NSUInteger)numberOfTapsRequired
                                                            block:(void (^)(UITapGestureRecognizer *))block {
    self.userInteractionEnabled = YES;
    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithActionBlock:block];
    recognizer.numberOfTapsRequired = numberOfTapsRequired;
    [self addGestureRecognizer:recognizer];
    return recognizer;
}

- (UITapGestureRecognizer *)addSingleTapGestureWithBlock:(void (^)(UITapGestureRecognizer *))block {
    [self.gestureRecognizers enumerateObjectsUsingBlock:^(__kindof UIGestureRecognizer * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:[UITapGestureRecognizer class]]) {
            [self removeGestureRecognizer:obj];
        }
    }];
    return [self addTapGestureWithNumberOfTapsRequired:1 block:block];
}

- (UITapGestureRecognizer *)addSingleTapGestureTarget:(id)target action:(SEL)action {
    self.userInteractionEnabled = YES;
    [self.gestureRecognizers enumerateObjectsUsingBlock:^(__kindof UIGestureRecognizer * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:[UITapGestureRecognizer class]]) {
            [self removeGestureRecognizer:obj];
        }
    }];
    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithTarget:target action:action];
    [self addGestureRecognizer:recognizer];
    return recognizer;
}

#pragma mark - Top and bottom line

- (CALayer *)topLineLayer {
    return objc_getAssociatedObject(self, _cmd);
}

- (void)setTopLineLayer:(CALayer *)topLineLayer {
    objc_setAssociatedObject(self, @selector(topLineLayer), topLineLayer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (CALayer *)bottomLineLayer {
    return objc_getAssociatedObject(self, _cmd);
}

- (void)setBottomLineLayer:(CALayer *)bottomLineLayer {
    objc_setAssociatedObject(self, @selector(bottomLineLayer), bottomLineLayer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (CALayer *)addSubLayerWithFrame:(CGRect)frame color:(UIColor *)color {
    CALayer *layer = [CALayer layer];
    layer.frame = frame;
    layer.backgroundColor = color.CGColor;
    [self.layer addSublayer:layer];
    return layer;
}

- (void)setTopFillLineWithColor:(UIColor *)color {
    [self setTopLineWithColor:color paddingLeft:0 paddingRight:0];
}

- (void)setTopLineWithColor:(UIColor *)color paddingLeft:(CGFloat)paddingLeft paddingRight:(CGFloat)paddingRight {
    CGRect frame = CGRectMake(paddingLeft,
                              0,
                              [UIScreen mainScreen].bounds.size.width - paddingLeft-paddingRight,
                              ONE_PIXEL);
    if (!self.topLineLayer) {
        self.topLineLayer = [self addSubLayerWithFrame:frame color:color];
    }else {
        self.topLineLayer.frame = frame;
        self.topLineLayer.backgroundColor = color.CGColor;
    }
}

- (void)setBottomFillLineWithColor:(UIColor *)color {
    [self setBottomLineWithColor:color paddingLeft:0 paddingRight:0];
}

- (void)setBottomLineWithColor:(UIColor *)color paddingLeft:(CGFloat)paddingLeft paddingRight:(CGFloat)paddingRight {
    CGRect frame = CGRectMake(paddingLeft,
                              self.h_height - ONE_PIXEL,
                              [UIScreen mainScreen].bounds.size.width - paddingLeft- paddingRight,
                              ONE_PIXEL);
    if (!self.bottomLineLayer) {
        self.bottomLineLayer = [self addSubLayerWithFrame:frame color:color];
    }else {
        self.bottomLineLayer.frame = frame;
        self.bottomLineLayer.backgroundColor = color.CGColor;
    }
    
}

- (void)setTopAndBottomLineWithColor:(UIColor *)color {
    [self setTopFillLineWithColor:color];
    [self setBottomFillLineWithColor:color];
}

- (UIView *)setTopLineViewWithColor:(UIColor *)color paddingLeft:(CGFloat)left paddingRight:(CGFloat)right {
    CGRect frame = self.frame;
    frame.origin = CGPointZero;;
    frame.origin.x += left;
    frame.size.width -= (left + right);
    frame.size.height = ONE_PIXEL;
    return [self addSubviewWithColor:color frame:frame];
}

- (UIView *)setBottomLineViewWithColor:(UIColor *)color paddingLeft:(CGFloat)left paddingRight:(CGFloat)right {
    CGRect frame = self.frame;
    frame.origin = CGPointZero;;
    frame.origin.x += left;
    frame.size.width -= (left + right);
    frame.origin.y = frame.size.height - ONE_PIXEL;
    frame.size.height = ONE_PIXEL;
    return [self addSubviewWithColor:color frame:frame];
}

- (UIView *)addSubviewWithColor:(UIColor *)color frame:(CGRect)frame {
    UIView *line = [[UIView alloc] init];
    line.frame = frame;
    line.backgroundColor = color;
    [self addSubview:line];
    return line;
}



#pragma mark - other

- (id)userInfo {
    return objc_getAssociatedObject(self, userInfoAddress);
}

- (void)setUserInfo:(id)userInfo {
    objc_setAssociatedObject(self, userInfoAddress, userInfo, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIViewController *)viewController {
    for (UIView *view = self; view; view = view.superview) {
        UIResponder *nextResponder = [view nextResponder];
        if ([nextResponder isKindOfClass:[UIViewController class]]) {
            return (UIViewController *)nextResponder;
        }
    }
    return nil;
}

- (void)setBoarderWith:(CGFloat)width color:(UIColor *)color {
    self.layer.borderWidth = width;
    self.layer.borderColor = color.CGColor;
}

- (void)setCornerRadius:(CGFloat)cornerRadius {
    self.clipsToBounds = YES;
    self.layer.cornerRadius = cornerRadius;
}

- (CGFloat)cornerRadius {
    return self.layer.cornerRadius;
}

- (void)setTipsViewWithImageName:(NSString *)imageName
                            text:(NSString *)text
                       textColor:(UIColor *)textColor {
    UIImageView *imageView = [self viewWithTag:TIPS_IMAGE_VIEW_TAG];
    if (!imageView) {
        imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    }
    imageView.center = CGPointMake(self.h_width / 2, self.h_height / 2 - 40);
    imageView.contentMode = UIViewContentModeCenter;
    imageView.tag = TIPS_IMAGE_VIEW_TAG;
    [self addSubview:imageView];
    
    UILabel *label = [self viewWithTag:TIPS_LABEL_TAG];
    if (!label) {
        label = [[UILabel alloc] initWithFrame:CGRectMake(0, imageView.h_maxY + 10, [UIScreen mainScreen].bounds.size.width, 20)];
    }
    label.font = [UIFont systemFontOfSize:16];
    label.textColor = textColor;
    label.text = text;
    label.textAlignment = NSTextAlignmentCenter;
    label.tag = TIPS_LABEL_TAG;
    [self addSubview:label];
}

- (void)removeTipsView {
    [[self viewWithTag:TIPS_IMAGE_VIEW_TAG] removeFromSuperview];
    [[self viewWithTag:TIPS_LABEL_TAG] removeFromSuperview];
}





//设置视图上边角幅度
- (void)setCornerRadiiOnTop:(CGFloat)radii {
    [self setGivenCorner:(UIRectCornerTopLeft | UIRectCornerTopRight) cornerRadii:radii];
}
//设置视图下边角幅度
- (void)setCornerRadiiOnBottom:(CGFloat)radii {
    [self setGivenCorner:(UIRectCornerBottomLeft | UIRectCornerBottomRight) cornerRadii:radii];
}
//设置指定角的角幅度
- (void)setGivenCorner:(UIRectCorner)corners cornerRadii:(CGFloat)radii {
    UIBezierPath *maskPath = nil;
    maskPath = [UIBezierPath bezierPathWithRoundedRect:self.bounds
                                     byRoundingCorners:corners
                                           cornerRadii:CGSizeMake(radii, radii)];
    CAShapeLayer *maskLayer = [[CAShapeLayer alloc] init];
    maskLayer.frame = self.bounds;
    maskLayer.path = maskPath.CGPath;
    self.layer.mask = maskLayer;
}
//设置视图所有角幅度
- (void)setAllCornerRadii:(CGFloat)radii {
    UIBezierPath *maskPath = nil;
    maskPath = [UIBezierPath bezierPathWithRoundedRect:self.bounds
                                          cornerRadius:radii];
    CAShapeLayer *maskLayer = [[CAShapeLayer alloc] init];
    maskLayer.frame = self.bounds;
    maskLayer.path = maskPath.CGPath;
    self.layer.mask = maskLayer;
}
//去掉视图所有角幅度
- (void)setNoneCorner {
    self.layer.mask = nil;
}



//根据视图生成图片
- (UIImage *)snapshotImage {
    UIGraphicsBeginImageContextWithOptions(self.bounds.size, self.opaque, 0);
    [self.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *snap = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return snap;
}

- (UIImage *)snapshotImageWithFrame:(CGRect)frame {
    UIGraphicsBeginImageContextWithOptions(frame.size, self.opaque, 0.0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextTranslateCTM(context, -frame.origin.x, -frame.origin.y);
    [self.layer renderInContext: context];
    CGContextTranslateCTM(context, frame.origin.x, frame.origin.y);
    UIImage *theImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return theImage;
}

- (NSData *)snapshotPDF {
    CGRect bounds = self.bounds;
    NSMutableData *data = [NSMutableData data];
    CGDataConsumerRef consumer = CGDataConsumerCreateWithCFData((__bridge CFMutableDataRef)data);
    CGContextRef context = CGPDFContextCreate(consumer, &bounds, NULL);
    CGDataConsumerRelease(consumer);
    if (!context) return nil;
    CGPDFContextBeginPage(context, NULL);
    CGContextTranslateCTM(context, 0, bounds.size.height);
    CGContextScaleCTM(context, 1.0, -1.0);
    [self.layer renderInContext:context];
    CGPDFContextEndPage(context);
    CGPDFContextClose(context);
    CGContextRelease(context);
    return data;
}

@end
