//
//  NSObject+HUtil.h
//  TestProject
//
//  Created by dqf on 2017/9/27.
//  Copyright © 2017年 dqfStudio. All rights reserved.
//

#import <Foundation/Foundation.h>

// prevent performSelector warning
#define SuppressPerformSelectorLeakWarning(Stuff) \
do { \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Warc-performSelector-leaks\"") \
Stuff; \
_Pragma("clang diagnostic pop") \
} while (0)

#define SuppressWdeprecatedDeclarationsWarning(Stuff) \
do { \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Wdeprecated-declarations\"") \
Stuff; \
_Pragma("clang diagnostic pop") \
} while (0)

/**
 * extend dispatch invoke
 * batch invoke methods of some pattern, these methods always in some categorys in some module
 * @param invokeString stringfromSelector，like -[className funcName]，we use '__func__'
 * @param preTag       preTag.  default is '_'
 *                     eg: faction '-init', and the preTag is 'abc',  then the function like - ***abcinit will invoked。
 * @param arguments
 */
//特定匹配符
#define H_ExtendInvoke_pre(preTag, args...) \
{ \
NSString *methodName = [NSString stringWithFormat:@"%s", __func__]; \
[self extendInvoke1:methodName withPre:preTag withMethodArgments:args];\
}
#define H_ExtendInvoke1(preTag) H_ExtendInvoke_pre(preTag, nil)
#define H_ExtendInvoke2(preTag, args...) H_ExtendInvoke_pre(preTag, args)
#define H_ExtendInvoke3(preTag) H_ExtendInvoke_pre([NSString stringWithFormat:@"%@_", preTag], nil)
#define H_ExtendInvoke4(preTag, args...) H_ExtendInvoke_pre([NSString stringWithFormat:@"%@_", preTag], args)
//通用匹配符
#define H_ExtendInvoke_(preTag, args...) \
{ \
NSString *methodName = [NSString stringWithFormat:@"%s", __func__]; \
[self extendInvoke2:methodName withPre:preTag withMethodArgments:args];\
}
#define H_ExtendInvoke5(args...) H_ExtendInvoke_(@"_", args)
#define H_ExtendInvoke6 H_ExtendInvoke_(@"_", nil)


//TODO will delete
// safe copy
#define safecp(arg,value,_class) arg = value;\
if (![arg isKindOfClass:[_class class]])\
{arg = nil;}

//Value range check
#define H_CheckProperty(t,p) \
@property (nonatomic) t p; \
@property (nonatomic) NSRange p##_;

#define H_CheckProperty2(p) H_CheckProperty(NSInteger,p)

#define H_CheckPropertyRange(p,location,length) \
- (NSRange)p##_ {\
return NSMakeRange(location, length);\
}

@interface NSObject (HUtil)

// deserializtion
// the data is always dictionary , it will map all value to the property if the key is equal to property name
- (instancetype)initWithSerializedData:(id)data;

// serialization
// the return is always dictionary
- (id)serialization;
+ (BOOL)isSerializationObject:(id)object;

// property list
- (NSArray *)ppList;

// property list of some class
+ (NSArray *)ppListOfClass:(Class)theClass;

// property list of some class , it will iterate search
+ (NSArray *)depPPListOfClass:(Class)theClass;

//whether object is system class
+ (BOOL)isSystemClass:(Class)aClass;

- (BOOL)isSystemClass:(Class)aClass;

//return super system class
+ (Class)seekToSystemClass:(Class)aClass;

- (Class)seekToSystemClass:(Class)aClass;

// get json string
- (NSString *)jsonString;

// swap two SEL and IMP
//if origSel isn't defined, you need call respondToSelector to check if selector is exsit
+ (void)methodSwizzleWithClass:(Class)c origSEL:(SEL)origSEL overrideSEL:(SEL)overrideSEL;

/**
 *  batch invoke methods of some pattern
 *  these methods always in some categorys in some module
 *  note：the invoke sequence is ambiguous
 *
 *  @param invokeString stringfromSelector，like -[className funcName]，we use '__func__'
 *  @param preTag       preTag. default is '_'
 *                      eg: faction '-init', and the preTag is 'abc',  then the function like - ***abcinit will invoked。
 *  @param firstParameter arguments
 */
//特定匹配符
- (id)extendInvoke1:(NSString *)invokeString withPre:(NSString *)preTag withMethodArgments:(void *)firstParameter, ...;
//通用匹配符
- (void)extendInvoke2:(NSString *)invokeString withPre:(NSString *)preTag withMethodArgments:(void *)firstParameter, ...;

@end

/**
 *  deserializtion
 *  set the data to the object, map all value to the property if the property is equal to key
 *
 *  @param object some object
 *  @param data   data
 */
void setObjectWithSerializedData(NSObject *object ,id data);

