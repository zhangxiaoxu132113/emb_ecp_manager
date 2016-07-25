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
        websocket.onmessage = function(messageData) {
            var message = messageData.data;
            console.log(message);
        }
        //消息接收
        //websocket.onmessage = function(message) {
        //    var message = JSON.parse(message.data);
        //    //接收用户发送的消息
        //    if (message.type == 'message') {
        //        output.receive(message);
        //    } else if (message.type == 'get_online_user') {
        //        //获取在线用户列表
        //        var root = onlineUser.getRootNode();
        //        Ext.each(message.list,function(user){
        //            var node = root.createNode({
        //                id : user,
        //                text : user,
        //                iconCls : 'user',
        //                leaf : true
        //            });
        //            root.appendChild(node);
        //        });
        //    } else if (message.type == 'user_join') {
        //        //用户上线
        //        var root = onlineUser.getRootNode();
        //        var user = message.user;
        //        var node = root.createNode({
        //            id : user,
        //            text : user,
        //            iconCls : 'user',
        //            leaf : true
        //        });
        //        root.appendChild(node);
        //    } else if (message.type == 'user_leave') {
        //        //用户下线
        //        var root = onlineUser.getRootNode();
        //        var user = message.user;
        //        var node = root.findChild('id',user);
        //        root.removeChild(node);
        //    }
        //}
    }
};

initWebSocket();