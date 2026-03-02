import axios from 'axios';

async function testApi() {
  try {
    console.log('测试API调用...');
    const response = await axios.get('http://localhost:3000/api/interview/pickups', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('响应状态:', response.status);
    console.log('响应头:', response.headers);
    console.log('响应数据:', response.data);
    console.log('响应数据类型:', typeof response.data);
    console.log('响应数据是否有code属性:', 'code' in response.data);
    console.log('响应数据是否有data属性:', 'data' in response.data);
    
    if (response.data.data) {
      console.log('响应数据的data属性:', response.data.data);
      console.log('响应数据的data属性类型:', typeof response.data.data);
      console.log('响应数据的data属性是否有list属性:', 'list' in response.data.data);
      console.log('响应数据的data属性是否有total属性:', 'total' in response.data.data);
    }
    
  } catch (error) {
    console.error('测试API调用错误:', error);
  }
}

testApi();