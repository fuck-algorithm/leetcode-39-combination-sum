import './WeChatFloat.css';

export function WeChatFloat() {
  return (
    <div className="wechat-float">
      <div className="wechat-float-btn">
        <span className="btn-text-main">交流群</span>
      </div>
      <div className="wechat-float-popup">
        <img src="/wechat-group-qr.png" alt="微信群二维码" />
        <p>扫码发送 <strong>leetcode</strong> 加入算法交流群</p>
      </div>
    </div>
  );
}
