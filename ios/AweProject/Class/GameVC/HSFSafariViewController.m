//
//  HSFSafariViewController.m
//  HProjectModel1
//
//  Created by TX-Kevin on 2019/4/29.
//  Copyright © 2019年 dqf. All rights reserved.
//

#import "HSFSafariViewController.h"

@interface HSFSafariViewController ()

@end

@implementation HSFSafariViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
  if([self respondsToSelector:NSSelectorFromString(@"_showingLinkPreview:")]){
    [self performSelector:NSSelectorFromString(@"_setShowingLinkPreviewWithMinimalUI:") withObject:[NSNumber numberWithBool:NO]];
  }
  if([self respondsToSelector:NSSelectorFromString(@"_setShowingLinkPreview:")]){
    [self performSelector:NSSelectorFromString(@"_setShowingLinkPreview:") withObject:[NSNumber numberWithBool:NO]];
  }
#pragma clang diagnostic pop
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */
- (void)loadURL:(NSURL *)URL{
  [self setValue:URL forKey:@"initialURL"];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
  [self performSelector:NSSelectorFromString(@"_connectToService")];
#pragma clang diagnostic pop
}
@end
