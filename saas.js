/* My Catalogue SaaS shared client. Publishable key only; never put a service-role key here. */
(() => {
  const SUPABASE_URL = 'https://mkodburhxdrvfacytovb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_FEJP96SGoEETQs_gaWjiqg_5LaRjyPw';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slugify = v => String(v || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);
  async function resolveBusiness() {
    const host = location.hostname.toLowerCase().replace(/^www\./,'');
    const platformHosts = ['localhost','127.0.0.1',''];
    const shop = new URLSearchParams(location.search).get('shop');
    if (!platformHosts.includes(host) && !host.endsWith('.github.io')) {
      const d = await sb.from('mc_saas_custom_domains').select('business_id').eq('domain',host).eq('verified',true).eq('active',true).maybeSingle();
      if (!d.error && d.data?.business_id) {
        const b = await sb.from('mc_saas_businesses').select('*').eq('id',d.data.business_id).eq('is_published',true).maybeSingle();
        if (!b.error && b.data) return b.data;
      }
    }
    if (shop) {
      const b = await sb.from('mc_saas_businesses').select('*').eq('slug',slugify(shop)).eq('is_published',true).maybeSingle();
      if (!b.error && b.data) return b.data;
    }
    return null;
  }
  async function optimizeImage(file, maxSize=1200, quality=.84) {
    if (!file || !file.type.startsWith('image/')) throw new Error('Choose an image file.');
    if (file.size > 15*1024*1024) throw new Error('Choose an image smaller than 15 MB.');
    const img = await new Promise((resolve,reject)=>{const i=new Image();const u=URL.createObjectURL(file);i.onload=()=>{URL.revokeObjectURL(u);resolve(i)};i.onerror=()=>{URL.revokeObjectURL(u);reject(new Error('Could not read this image.'))};i.src=u;});
    const scale=Math.min(1,maxSize/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if (!blob) throw new Error('Image optimization failed in this browser.');
    return new File([blob],(file.name.replace(/\.[^.]+$/,'')||'photo')+'.webp',{type:'image/webp'});
  }
  window.MC = { sb, esc, slugify, resolveBusiness, optimizeImage, money:(n,c='USD') => (c==='LBP'?'LBP ':'$')+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2}) };
})();
