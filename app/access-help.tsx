import { checkoutLink } from './pages-runtime';

export function AccessHelp() {
  return <details className="access-help">
    <summary>官网打不开？联系人工客服</summary>
    <p>微信 <strong>imhuangshu</strong> · 北京时间 09:00–20:00</p>
    <p>已付款请提供订单号，方便客服核对。请勿重复付款。</p>
    <a href="mailto:2031887069@qq.com">邮件联系 2031887069@qq.com</a>
  </details>;
}

export function OrdersEntry() {
  return <section className="wrap page-space">
    <div className="page-heading"><h1>我的订单与已购手账</h1>
      <p>用下单时的账号登录官网，查看核款进度、下载手账或查看入营安排。</p>
    </div>
    <a className="btn btn-dark" href={checkoutLink('/orders')}>前往官网查看订单</a>
    <AccessHelp/>
    <p><a href="#/cinema">返回手账试读</a></p>
  </section>;
}
