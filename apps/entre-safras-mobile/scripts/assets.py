"""Original geometric vector artwork and PWA icons; no external images/fonts."""
from pathlib import Path
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parents[1] / 'public'
out = root / 'art'
out.mkdir(exist_ok=True)
def svg(name, body, box='0 0 160 120'):
    (out / f'{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}">{body}</svg>', encoding='utf-8')
leaf = '<path d="M80 93V47M80 70Q36 68 43 33Q82 32 80 70M80 57Q80 23 116 26Q120 57 80 57" fill="#245943" stroke="#20372D" stroke-width="4" stroke-linecap="round"/>'
house = '<path d="M42 55L80 26L118 55" fill="#A84732"/><path d="M48 55H112V101H48Z" fill="#E9B95F"/><path d="M72 69H88V101H72Z" fill="#245943"/>'
sun = '<circle cx="112" cy="31" r="19" fill="#E9B95F"/>'
field = '<path d="M0 86Q65 57 160 86V120H0Z" fill="#9cae6b"/><path d="M5 110L73 84M43 120L104 86M91 120L137 90" fill="none" stroke="#245943" stroke-width="4"/>'
svg('vila', '<rect width="480" height="260" fill="#dce6d6"/><circle cx="365" cy="54" r="30" fill="#E9B95F"/><path d="M0 119Q120 53 251 113T480 108V260H0Z" fill="#a4b581"/><path d="M0 180Q120 142 221 194T480 182V260H0Z" fill="#769365"/><path d="M328 105Q230 150 334 194T300 270H397Q450 222 360 175T383 108Z" fill="#6b9ba7"/><g transform="translate(150 74)">'+house+'</g><g transform="translate(18 137) scale(.7)">'+house+'</g><path d="M34 218L116 192M60 239L143 210M89 255L167 231" stroke="#E9B95F" stroke-width="9"/><g fill="#245943"><circle cx="61" cy="101" r="29"/><circle cx="100" cy="87" r="23"/><circle cx="433" cy="139" r="27"/></g><path d="M62 97V157M102 89V131M433 139V191" stroke="#61462f" stroke-width="8"/>', '0 0 480 260')
for name, shirt, hair, accessory in [('lia','#245943','#30352a','<circle cx="111" cy="99" r="19" fill="#ba8950"/><path d="M96 94Q111 66 126 94" fill="none" stroke="#61462f" stroke-width="4"/>'),('bento','#A84732','#61462f','<path d="M30 37H129L112 29L101 10H61L48 29Z" fill="#E9B95F"/>'),('rosa','#24566A','#30352a','<rect x="101" y="83" width="23" height="29" rx="3" fill="#FFFCF5"/><path d="M105 91H119M105 98H119" stroke="#24566A" stroke-width="2"/>')]:
    svg(name, f'<circle cx="80" cy="65" r="60" fill="#e5dcbf"/><path d="M33 120Q33 76 80 76Q127 76 127 120" fill="{shirt}"/><ellipse cx="80" cy="46" rx="30" ry="34" fill="{hair}"/><ellipse cx="80" cy="52" rx="23" ry="28" fill="#bb835c"/><path d="M56 40Q64 5 104 39" fill="{hair}"/><circle cx="71" cy="52" r="2" fill="#20372D"/><circle cx="90" cy="52" r="2" fill="#20372D"/><path d="M73 65Q80 71 88 64" fill="none" stroke="#61462f" stroke-width="2"/>{accessory}')
events = {
 'drought':sun+'<path d="M0 86H160V120H0Z" fill="#cfac77"/><path d="M30 87L52 99L42 120M52 99L81 96L101 118M81 96L88 83M127 87L137 99L127 120" stroke="#A84732" fill="none" stroke-width="4"/>',
 'flood':'<path d="M30 44Q10 11 48 13Q74 -5 94 20Q135 10 134 43Z" fill="#24566A"/><path d="M39 55L30 76M71 55L62 76M103 55L94 76" stroke="#24566A" stroke-width="5"/><path d="M0 90Q20 78 40 90T80 90T120 90T160 90V120H0Z" fill="#6b9ba7"/>',
 'pests':field+'<ellipse cx="83" cy="50" rx="21" ry="29" fill="#A84732"/><path d="M83 24V80M63 38L43 28M63 55L40 60M102 38L122 28M102 55L127 60" stroke="#20372D" stroke-width="4"/><circle cx="83" cy="21" r="12" fill="#20372D"/>',
 'favorable':sun+field+leaf,
 'fair':'<path d="M23 40H137L122 15H39Z" fill="#A84732"/><path d="M30 42V101M130 42V101" stroke="#61462f" stroke-width="7"/><path d="M20 79H140V107H20Z" fill="#E9B95F"/><g fill="#245943"><circle cx="51" cy="72" r="12"/><circle cx="80" cy="72" r="12"/><circle cx="108" cy="72" r="12"/></g>',
 'regular':field+leaf,
}
for name, body in events.items(): svg(name, body)
symbols = {'A1':leaf, 'A2':leaf+'<circle cx="47" cy="82" r="10" fill="#A84732"/><circle cx="116" cy="82" r="10" fill="#E9B95F"/>','A3':'<path d="M35 57L49 106H113L127 57Z" fill="#ba8950"/><path d="M50 59Q80 2 111 59" stroke="#61462f" fill="none" stroke-width="6"/>','A4':house,'G1':'<path d="M35 30Q55 17 80 32Q110 17 131 30V96Q107 85 80 99Q56 85 35 96Z" fill="#E9B95F" stroke="#24566A" stroke-width="4"/><path d="M80 33V96" stroke="#24566A" stroke-width="4"/>','G2':'<path d="M80 13L125 31V65Q122 95 80 111Q38 95 35 65V31Z" fill="#24566A"/><path d="M56 58L75 79L108 43" stroke="#FFFCF5" fill="none" stroke-width="7"/>','G3':'<circle cx="65" cy="60" r="32" fill="#E9B95F"/><path d="M66 60H128M110 42L128 60L110 78" stroke="#24566A" stroke-width="7" fill="none"/>','G4':house}
for name, body in symbols.items(): svg(name, body)
for name, body in [('soil_cover',symbols['A1']),('diversification',symbols['A2']),('cooperative',house)]: svg(name,body)
for size, name in [(192,'icon-192.png'),(512,'icon-512.png'),(512,'maskable-512.png')]:
    im=Image.new('RGB',(size,size),'#245943'); d=ImageDraw.Draw(im); k=size/512
    def points(ps): return [(int(x*k),int(y*k)) for x,y in ps]
    d.ellipse((int(103*k),int(103*k),int(409*k),int(409*k)),fill='#F5F1E6')
    d.line(points([(255,366),(255,215)]),fill='#245943',width=int(15*k))
    d.ellipse((int(161*k),int(167*k),int(255*k),int(260*k)),fill='#245943')
    d.ellipse((int(255*k),int(142*k),int(350*k),int(235*k)),fill='#245943')
    d.arc((int(150*k),int(300*k),int(362*k),int(397*k)),180,360,fill='#A84732',width=int(16*k))
    im.save(root/name,optimize=True)
print('21 SVGs originais e 3 ícones PNG gerados.')
