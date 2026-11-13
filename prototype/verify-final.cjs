'use strict';
// Reproducible final acceptance checks. These call the model; they are not browser clicks.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const T = require('./model.js');
const rows = [];
function open(key, options) { const s=T.create(key,options);T.choose(s);return s; }
function record(id,key,variant,expected,check) {
  const s = key==='K2' ? T.create('K1') : open(key,{variant});
  check(s);
  assert.equal(s.log.some(e => ['thuc_hien_hoan_tien','tu_choi_khieu_nai'].includes(e.tool) && ['AI','SYSTEM','BUYER-DEMO'].includes(e.actor)),false);
  rows.push({id,scenario:key,variant,order:key==='K2'?null:s.fixture.id,expected,pass:true,messages:s.messages,log:s.log,decision:s.decision});
}
record('F01','K1','default','Hướng dẫn, nháp, người mua gửi, người bán xác nhận',s=>{
 assert.ok(s.messages.some(m=>m.text.includes('size L')));
 T.evidence(s,false);T.prepare(s);assert.equal(s.receipt,null);T.submit(s);
 assert.ok(s.receipt);assert.equal(T.decide(s,'refund','SELLER-DEMO','Đối chiếu size L đã đặt với nhãn M, người bán đồng ý hoàn mô phỏng.',true),true);
});
record('F02','K2','default','Hỏi đúng đơn, không gửi cho shop',s=>{
 T.route(s,'hàng sai rồi, xử lý đi');assert.equal(s.chosen,false);assert.ok(s.messages.at(-1).text.includes('Bạn đang nói đơn nào'));
 assert.ok(!s.log.some(e=>e.tool==='yeu_cau_bang_chung'));
});
record('F03','K3','default','Phân biệt tổng/giỏ; hỏi trước, không hoàn theo lời doạ',s=>{
 assert.ok(s.messages.some(m=>m.text.includes('dung tích tổng 6L')));T.answer(s,'Giỏ chiên');assert.equal(s.askedAt,null);assert.equal(s.decision,null);
});
record('F04','K3','anh_tem_mo','Không trích thông số chưa đọc, chỉ xin ảnh rõ',s=>{
 assert.equal(s.labelReadable,false);assert.ok(s.messages.some(m=>m.text.includes('Ảnh tem hiện chưa đọc rõ')));
 assert.ok(!s.messages.filter(m=>m.role!=='user').some(m=>/6.0L|5.0L/.test(m.text)));
});
record('F05','K4','default','Dùng bản lúc đặt, xin đúng nhãn còn thiếu',s=>{
 assert.ok(s.messages.some(m=>m.text.includes('100% cotton')&&m.text.includes('07/11/2026')));assert.equal(s.label,false);
});
record('F06','K4','co_anh_nhan','Không xin lại nhãn; chỉ soạn khi người mua chọn',s=>{
 assert.equal(s.draft,null);assert.ok(s.messages.some(m=>m.text.includes('không cần gửi lại')));T.prepare(s);assert.ok(s.draft);assert.equal(s.receipt,null);
});
record('F07','K4','thieu_ban_luc_dat','Thiếu nguồn thì dừng kết luận, chuyển người',s=>{
 assert.equal(T.source(s),false);assert.notEqual(s.escalatedAt,null);
 assert.ok(!s.messages.filter(m=>m.role==='assistant').some(m=>m.text.includes('khớp')));
 assert.notEqual(T.gate(s,'reject','MANAGER-DEMO'),'');
});
record('F08','K5','default','Giữ hai ảnh toàn cảnh, chỉ xin nhãn một lần',s=>{
 T.route(s,'mình gửi ảnh rồi, còn thiếu gì');assert.equal(s.overviewImages,2);
 assert.equal(s.log.filter(e=>e.tool==='yeu_cau_bang_chung').length,1);
 assert.ok(s.messages.some(m=>m.text.includes('Đã gửi thành công yêu cầu bổ sung')));
});
record('F09','K6','default','Chuyển chuyên trách; vẫn hỗ trợ đơn, không phạt',s=>{
 assert.equal(s.type,'nghi_hang_gia');assert.notEqual(s.escalatedAt,null);
 assert.ok(s.messages.some(m=>m.text.includes('chính đơn của bạn')));
 assert.ok(s.context.some(c=>c.includes('đăng lên báo')));assert.equal(s.messages[0].role,'user');
});
record('F10','K7','default','Giữ liên hệ riêng tư, nêu kênh và dự kiến 48 giờ',s=>{
 const reply=s.messages.find(m=>m.role==='assistant').text;assert.ok(reply.includes('Không chia sẻ'));assert.ok(reply.includes('48 giờ'));assert.ok(reply.includes('chưa bắt đầu'));
});
record('F11','K8','default','Xét bằng chứng riêng, không gọi đánh giá shop là lời doạ',s=>{
 const reply=s.messages.find(m=>m.role==='assistant').text;assert.ok(reply.includes('ảnh nhãn'));assert.ok(!reply.includes('Lời doạ'));assert.equal(s.decision,null);
});
record('F12','K9','co_bien_nhan','Tra biên nhận 11/11 trong hạn, chuyển khi quá 48 giờ',s=>{
 assert.equal(new Date(s.receipt.at).toISOString(),'2026-11-11T07:00:00.000Z');assert.equal(s.receipt.inTime,true);
 assert.equal(T.sellerDone(s),true);assert.notEqual(s.escalatedAt,null);
 assert.ok(!s.log.some(e=>e.tool==='gui_yeu_cau_giao_dien'));
});
record('F13','K9','chua_co_bien_nhan','Chat/nháp không thay biên nhận; hướng dẫn gửi ngay',s=>{
 assert.equal(s.receipt,null);assert.equal(s.askedAt,null);assert.ok(s.messages.at(-1).text.includes('gửi ngay'));
});
record('F14','K10','default','Tách đổi địa chỉ, vẫn xử lý khiếu nại sai màu',s=>{
 const reply=s.messages.find(m=>m.role==='assistant').text;assert.ok(reply.includes('đổi địa chỉ'));assert.ok(reply.includes('khiếu nại sai màu'));assert.ok(!reply.includes('Không chia sẻ'));
});
const regressions = [];
function regression(id,key,input,check) { const s=open(key); if(input)T.route(s,input); check(s); regressions.push({id,key,input,pass:true,messages:s.messages,log:s.log}); }
regression('L1','K10','áo sai màu, tiện đổi địa chỉ nhận luôn nha',s=>{const t=s.messages.at(-1).text;assert.ok(t.includes('khiếu nại sai màu'));assert.ok(!t.includes('Không chia sẻ'));});
regression('L2','K1','ko xử là mình đăng lên báo',s=>assert.ok(s.context.some(x=>x.includes('đăng lên báo'))));
regression('L3','K1','shop bán hàng fake, khoá shop đi',s=>{const last=s.messages.slice(-3);assert.equal(last[0].role,'user');assert.equal(last[1].role,'assistant');assert.equal(last[2].role,'system');});
regression('L4','K4',null,s=>{T.prepare(s);T.submit(s);T.transfer(s);T.advance(s,24);assert.notEqual(T.gate(s,'refund','MANAGER-DEMO'),'');assert.equal(s.decision,null);});
regression('L5','K4','tiện đổi giúp mình số điện thoại nhận hàng luôn nha',s=>{const t=s.messages.at(-1).text;assert.ok(t.includes('đổi số điện thoại'));assert.ok(!t.includes('Cần ảnh nhãn'));});
regression('L6','K8',null,s=>assert.ok(!s.messages.filter(m=>m.role==='assistant').some(m=>m.text.includes('Lời doạ'))));
regression('L7','K5',null,s=>{const t=T.create('K5');t.failNext=true;T.choose(t);assert.equal(t.buyerEvidenceAsked,false);T.requestBuyerEvidence(t);assert.equal(t.error,null);assert.ok(t.messages.at(-1).text.includes('Đã gửi thành công'));s.messages=t.messages;s.log=t.log;});
regression('L8','K4','cho mình địa chỉ kho của shop để gửi trả hàng',s=>{assert.ok(s.messages.at(-1).text.includes('hướng dẫn gửi trả chính thức'));assert.ok(!s.messages.at(-1).text.includes('Cần ảnh nhãn'));});
regression('L9','K4','mình chưa nhận được hàng mà app báo giao rồi',s=>{assert.ok(s.messages.at(-1).text.includes('Giao nhận'));assert.ok(!s.messages.at(-1).text.includes('Cần ảnh nhãn'));});
const sourceFiles=['model.js','app.js','styles.css','index.html','model.test.cjs','verify-final.cjs'];
const hashes=Object.fromEntries(sourceFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,file),'utf8').replace(/\r\n/g,'\n')).digest('hex')]));
const tapPath=path.join(__dirname,'final-evidence','model-tests.tap');
const tap=fs.readFileSync(tapPath,'utf8');
const unitTests=Number(tap.match(/^# tests (\d+)/m)?.[1]),unitPass=Number(tap.match(/^# pass (\d+)/m)?.[1]),unitFail=Number(tap.match(/^# fail (\d+)/m)?.[1]);
assert.ok(unitTests>0);assert.equal(unitPass,unitTests);assert.equal(unitFail,0);
const report={recordedAt:new Date().toISOString(),verificationLevel:'model acceptance + regression tests + HTML render smoke (mock DOM); no final browser rerun',businessTime:'2026-11-13T15:00:00+07:00',hashMode:'SHA-256 UTF-8 normalized LF',sourceHashes:hashes,unitTests:{total:unitTests,pass:unitPass,fail:unitFail},acceptance:{total:rows.length,pass:rows.filter(r=>r.pass).length,fail:0},cases:rows,regressions:{total:regressions.length,pass:regressions.length,fail:0,cases:regressions}};
const out=path.join(__dirname,'final-evidence');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
const table=rows.map(r=>'| '+r.id+' | '+r.scenario+' · '+r.variant+' | '+r.expected+' | Pass tự động |').join('\n');
const md='# Bằng chứng final — A90 / T4\n\n'+
'Ngày ghi nhận: '+report.recordedAt+'. Thời gian nghiệp vụ và dữ liệu đều dựng.\n\n'+
'**'+unitPass+'/'+unitTests+' kiểm thử hồi quy đạt; '+rows.length+'/'+rows.length+' lượt nghiệm thu model đạt.** Có kiểm tra dựng HTML trong DOM giả. Không coi đây là kết quả bấm lại trên trình duyệt hoặc demo trước lớp.\n\n'+
'| Mã | Ca | Điều đã kiểm | Kết quả |\n|---|---|---|---|\n'+table+'\n\n'+
'**9/9 ca lạ L1–L9 đã kiểm lại ở model: Pass.** Chi tiết và log riêng được lưu trong JSON.\n\nNguồn, tin nhắn, actor, tool và thời điểm từng lượt: [results.json](results.json). Kết quả kiểm thử: [model-tests.tap](model-tests.tap).\n\n'+
'Bộ ảnh [UX baseline](../ux-evidence/README.md) được tạo trước lượt sửa final. Các vị trí [1]–[8] và bố cục chính giữ nguyên; nút rút/trả hồ sơ và câu chữ final chưa được chụp lại vì công cụ browser không khả dụng trong phiên hoàn thiện. Không gán 26/26 lượt Chrome cũ thành lượt kiểm của nguồn final.\n\n'+
'Chạy lại từ gốc repo (có Node.js):\n\n    node prototype/model.test.cjs > prototype/final-evidence/model-tests.tap\n    node prototype/verify-final.cjs\n\n'+
'Mọi hash ở results.json được chuẩn hóa LF để không báo lệch chỉ vì Windows đổi CRLF. Nếu sửa nguồn, cần chạy lại hai lệnh trên.\n';
fs.writeFileSync(path.join(out,'README.md'),md);
console.log(JSON.stringify({unitTests:report.unitTests,acceptance:report.acceptance,regressions:{total:regressions.length,pass:regressions.length},output:'prototype/final-evidence/results.json'}));
