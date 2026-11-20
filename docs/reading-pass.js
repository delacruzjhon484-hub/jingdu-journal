(() => {
  const plans = {
    month: { label: '月卡', price: 3900, books: 4 },
    year: { label: '年卡', price: 36000, books: 48 }
  };
  const quantities = { month: 4, year: 48 };
  const input = document.getElementById('quantity');
  const result = document.getElementById('result');
  const buttons = document.querySelectorAll('[data-term]');
  const yuan = cents => '¥' + (cents / 100).toFixed(2);
  let term = 'month';
  function update() {
    const count = input.valueAsNumber;
    if (!Number.isInteger(count) || count < 1 || count > 365) {
      result.textContent = '请输入 1 至 365 之间的整本数。';
      return;
    }
    quantities[term] = count;
    const plan = plans[term];
    const single = count * 1290;
    const extra = Math.max(0, count - plan.books);
    const card = plan.price + extra * 1290;
    const choice = card === single ? '两种方式同价。' : (card < single ? '选' + plan.label : '单买') + '省 ' + yuan(Math.abs(single - card)) + '。';
    result.textContent = '逐本买 ' + yuan(single) + '；' + plan.label + (extra ? '加单买 ' + extra + ' 本' : '') + '共 ' + yuan(card) + '。' + choice;
  }
  for (const button of buttons) button.addEventListener('click', () => {
    term = button.dataset.term;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    input.value = quantities[term];
    update();
  });
  input.addEventListener('input', update);
  update();
  document.getElementById('calculator').hidden = false;
})();
