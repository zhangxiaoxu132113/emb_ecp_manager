var websocket;

//初始话WebSocket
function initWebSocket() {
    if (window.WebSocket) {
        websocket = new WebSocket(encodeURI('ws://localhost:8080/message'));
        websocket.onopen = function() {
            //连接成功
            console.log("已连接");
        }
        websocket.onerror = function() {
            //连接失败
            console.log("连接出现错误");
        }
        websocket.onclose = function() {
            //连接断开
            console.log("链接已经断开");
        }
        //消息接收
        websocket.onmessage = function(messageData) {
            var message = messageData.data;
            console.log(message);
        }
    }
};

//简历webSocket连接
initWebSocket();

//发送消息给服务器端

