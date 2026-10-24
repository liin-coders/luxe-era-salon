(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const header=$('header'), toTop=$('#toTop');
  window.addEventListener('scroll',()=>{
    header.classList.toggle('scrolled',scrollY>20);
    toTop.classList.toggle('show',scrollY>400);
  });
  toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  /* mobile menu */
  const burger=$('.hamburger'), links=$('.nav-links');
  burger.addEventListener('click',()=>{burger.classList.toggle('on');links.classList.toggle('open')});
  $$('.has-mega>a').forEach(a=>a.addEventListener('click',e=>{
    if(innerWidth<=900){e.preventDefault();a.parentElement.classList.toggle('open')}
  }));
  $$('.nav-links a:not(.has-mega>a)').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('on');links.classList.remove('open')}));
  /* reveal */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));
  /* before/after */
  $$('.ba').forEach(b=>{const r=$('input',b);r.addEventListener('input',()=>b.style.setProperty('--pos',r.value+'%'))});
  /* product filter */
  $$('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.filters button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');
    const f=btn.dataset.f;
    $$('.prod').forEach(p=>p.classList.toggle('hide',f!=='all'&&p.dataset.cat!==f));
  }));
  /* product enquiry on whatsapp */
  $$('[data-enquire]').forEach(b=>b.addEventListener('click',()=>{
    const t=`Hello ${SALON.name}, I want to enquire about: ${b.dataset.enquire}`;
    window.open(`https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(t)}`,'_blank');
  }));
  /* booking form: date strip + time slots -> whatsapp */
  const form=$('#bookingForm');
  if(form){
    /* salon timings: [open hour, close hour] by weekday (0=Sun). Last slot = close - 1 hour */
    const HOURS={0:[11,18],1:[10,20],2:[10,20],3:[10,20],4:[10,20],5:[10,20],6:[10,21]};
    const STEP=30, DAYS=30, LEAD_MIN=60;
    const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const fmt=m=>{const h=Math.floor(m/60),mm=m%60,ap=h>=12?'PM':'AM';return String(h%12||12).padStart(2,'0')+':'+String(mm).padStart(2,'0')+' '+ap};
    const strip=$('#dateStrip'), wrap=$('#slotWrap');
    const dateIn=$('#date'), timeIn=$('#time'), guests=$('#guests');
    const days=[...Array(DAYS)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+i);return d});
    const slotsFor=d=>{
      const [o,c]=HOURS[d.getDay()],out=[];
      const now=new Date(), isToday=iso(d)===iso(now), nowM=now.getHours()*60+now.getMinutes()+LEAD_MIN;
      for(let m=o*60;m<=(c-1)*60;m+=STEP) out.push({m,off:isToday&&m<nowM});
      return out;
    };
    const hasFree=d=>slotsFor(d).some(s=>!s.off);
    const longDate=d=>DN[d.getDay()]+', '+d.getDate()+' '+MN[d.getMonth()]+' '+d.getFullYear();
    const MF=['January','February','March','April','May','June','July','August','September','October','November','December'];
    const inRange=new Set(days.map(iso));
    const first=days[0], last=days[days.length-1];
    let vy=first.getFullYear(), vm=first.getMonth();
    function renderDates(){
      strip.innerHTML='';
      const head=document.createElement('div');head.className='cal-head';
      const prev=document.createElement('button');prev.type='button';prev.className='cal-nav';prev.setAttribute('aria-label','Previous month');prev.innerHTML='‹';
      const next=document.createElement('button');next.type='button';next.className='cal-nav';next.setAttribute('aria-label','Next month');next.innerHTML='›';
      const title=document.createElement('b');title.textContent=MF[vm]+' '+vy;
      prev.disabled=(vy*12+vm)<=(first.getFullYear()*12+first.getMonth());
      next.disabled=(vy*12+vm)>=(last.getFullYear()*12+last.getMonth());
      prev.addEventListener('click',()=>{vm--;if(vm<0){vm=11;vy--}renderDates()});
      next.addEventListener('click',()=>{vm++;if(vm>11){vm=0;vy++}renderDates()});
      head.append(prev,title,next);strip.appendChild(head);
      const wk=document.createElement('div');wk.className='cal-week';
      DN.forEach(n=>{const s=document.createElement('span');s.textContent=n;wk.appendChild(s)});
      strip.appendChild(wk);
      const grid=document.createElement('div');grid.className='cal-grid';
      const offset=new Date(vy,vm,1).getDay(), total=new Date(vy,vm+1,0).getDate();
      for(let i=0;i<offset;i++){const e=document.createElement('i');grid.appendChild(e)}
      for(let n=1;n<=total;n++){
        const d=new Date(vy,vm,n), key=iso(d);
        const b=document.createElement('button');b.type='button';b.className='cd';b.textContent=n;b.dataset.date=key;
        const ok=inRange.has(key)&&hasFree(d);
        b.disabled=!ok;
        if(key===iso(first))b.classList.add('today');
        if(dateIn.value===key)b.classList.add('on');
        b.setAttribute('aria-label',longDate(d));
        b.addEventListener('click',()=>pickDate(d));
        grid.appendChild(b);
      }
      strip.appendChild(grid);
      const lg=document.createElement('div');lg.className='cal-legend';
      lg.innerHTML='<span><i class="lg-on"></i>Selected</span><span><i class="lg-today"></i>Today</span><span><i class="lg-off"></i>Unavailable</span>';
      strip.appendChild(lg);
    }
    function renderSlots(d){
      wrap.innerHTML='';
      const list=slotsFor(d);
      [['Morning','☀',m=>m<720],['Afternoon','⛅',m=>m>=720&&m<960],['Evening','🌙',m=>m>=960]].forEach(([t,i,f])=>{
        const part=list.filter(s=>f(s.m)); if(!part.length)return;
        const g=document.createElement('div');g.className='slot-group';
        g.innerHTML='<h5><span>'+i+'</span>'+t+'</h5>';
        const row=document.createElement('div');row.className='slots';
        part.forEach(s=>{
          const b=document.createElement('button');b.type='button';b.className='slot';b.textContent=fmt(s.m);b.disabled=s.off;b.setAttribute('aria-pressed','false');
          if(timeIn.value===fmt(s.m)&&!s.off){b.classList.add('on');b.setAttribute('aria-pressed','true')}
          b.addEventListener('click',()=>{
            $$('.slot',wrap).forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});
            b.classList.add('on');b.setAttribute('aria-pressed','true');timeIn.value=b.textContent;
            $('[data-for=time]').classList.remove('bad');summary();
          });
          row.appendChild(b);
        });
        g.appendChild(row);wrap.appendChild(g);
      });
    }
    function pickDate(d){
      dateIn.value=iso(d);vy=d.getFullYear();vm=d.getMonth();renderDates();
      const chosen=timeIn.value; renderSlots(d);
      if(chosen&&!$('.slot.on',wrap))timeIn.value='';
      $('[data-for=date]').classList.remove('bad');summary();
    }
    function summary(){
      $('#sService').textContent=$('#service').value||'—';
      $('#sDate').textContent=dateIn.value?longDate(new Date(dateIn.value+'T00:00:00')):'—';
      $('#sTime').textContent=timeIn.value||'—';
      $('#sGuests').textContent=guests.value;
    }
    renderDates();
    wrap.innerHTML='<p class="slot-hint">Select a date to see available time slots.</p>';
    const firstOk=days.find(hasFree); if(firstOk)pickDate(firstOk);
    $('#service').addEventListener('change',()=>{summary();$('#service').closest('.field').classList.remove('bad')});
    const setG=v=>{v=Math.max(1,Math.min(10,v));guests.value=v;$('#guestsOut').textContent=v;summary()};
    $('#gMinus').addEventListener('click',()=>setG(+guests.value-1));
    $('#gPlus').addEventListener('click',()=>setG(+guests.value+1));
    const pre=new URLSearchParams(location.search).get('service');
    if(pre&&$('#service')){$('#service').value=pre;summary()}
    form.addEventListener('submit',e=>{
      e.preventDefault();let ok=true;
      $$('.field[data-req]',form).forEach(f=>{
        const i=$('input,select',f);const v=i.value.trim();
        let bad=!v; if(i.id==='phone'&&v&&!/^[0-9+\-\s]{10,15}$/.test(v))bad=true;
        f.classList.toggle('bad',bad); if(bad)ok=false;
      });
      if(!ok){const first=$('.field.bad',form);first.scrollIntoView({behavior:'smooth',block:'center'});const f=$('input[type=text],input[type=tel],select',first);if(f)f.focus();return}
      const g=id=>($('#'+id).value||'').trim()||'-';
      const msg=
`*New Appointment Request - ${SALON.name}*

*Name:* ${g('name')}
*Phone:* ${g('phone')}
*Email:* ${g('email')}
*Service:* ${g('service')}
*Preferred Stylist:* ${g('stylist')}
*Date:* ${longDate(new Date(dateIn.value+'T00:00:00'))}
*Time Slot:* ${g('time')}
*Persons:* ${g('guests')}
*Notes:* ${g('message')}

Please confirm my booking. Thank you!`;
      window.open(`https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');
    });
  }
  const y=$('#year'); if(y)y.textContent=new Date().getFullYear();
})();
