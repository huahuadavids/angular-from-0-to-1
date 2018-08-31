var _ = require("lodash")


/**
 * @工具方法
 */

{
  var arr1 = _.range(10)    // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  var arr2 = _.range(3,10)  // [ 3, 4, 5, 6, 7, 8, 9 ]
  var arr3 = _.range(2,6,2) // [ 2, 4 ]
}

{
  // 把后边函数的执行结果放到一个数组里
  var res1 = _.times(3, function(){return 1});
  console.log(res1)// [1,1,1]
}

{
  // 产生一个唯一的ID
  var id = _.uniqueId("huahua-")
  console.log(id) //huahua-1
  var id1= _.uniqueId("huahua-");
  console.log(id1)//huahua-2
}