// 测试脚本：验证测试功能是否正常工作

// 模拟用户点击"下一个"按钮
const testQuizFunctionality = () => {
  console.log('=== 测试测试功能 ===');
  
  // 检查words数组
  console.log('单词数量:', window.words?.length || 0);
  
  // 检查currentIndex
  console.log('当前索引:', window.currentIndex || 0);
  
  // 检查showQuiz状态
  console.log('测试显示状态:', window.showQuiz || false);
  
  // 检查currentQuizWord
  console.log('当前测试单词:', window.currentQuizWord);
  
  // 检查quizType
  console.log('测试类型:', window.quizType);
  
  // 检查quizOptions
  console.log('测试选项:', window.quizOptions);
  
  console.log('=== 测试完成 ===');
};

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testQuizFunctionality;
} else {
  window.testQuizFunctionality = testQuizFunctionality;
}
