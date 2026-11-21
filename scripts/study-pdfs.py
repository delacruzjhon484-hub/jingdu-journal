"""Build the four free PDF editions and their flipbook plates from study.html."""
from pathlib import Path
from tempfile import TemporaryDirectory
import re
import pymupdf as pdf
from PIL import Image
from lxml import html
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen

public = Path(__file__).resolve().parents[1] / 'public'
root = html.parse(str(public / 'study.html'))
latin = TTFont('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf')
latin_subset = subset.Subsetter()
latin_subset.populate(text=root.getroot().text_content()+'READING ROOM0123456789 /')
latin_subset.subset(latin)
with TemporaryDirectory() as tmp:
    path = Path(tmp)/'english.ttf'
    latin.save(path)
    serif = pdf.Font(fontfile=str(path))
ink, muted, paper = (0.16, 0.19, 0.16), (0.36, 0.39, 0.33), (1, .989, .96)
W, H, margin = 440, 600, 37

def line(page, x, y, value, font, size, color=ink):
    writer = pdf.TextWriter(page.rect)
    writer.append((x, y), value, font=font, fontsize=size)
    writer.write_text(page, color=color)

def paragraph(page, value, font, size, y, color=ink, leading=1.42):
    current = ''
    for token in re.findall(r"[A-Za-z0-9’'-]+|.", value):
        candidate = current + token
        if current and font.text_length(candidate, fontsize=size) > W-2*margin:
            line(page, margin, y, current.rstrip(), font, size, color)
            current, y = token.lstrip(), y+size*leading
        else:
            current = candidate
    if current:
        line(page, margin, y, current.rstrip(), font, size, color)
        y += size*leading
    return y

for book in root.xpath('//section[@data-id]'):
    slug, title = book.get('data-id'), book.get('aria-label')
    chapters = book.xpath('.//article')
    folder = public / 'study-pdfs' / slug
    folder.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory() as tmp:
        font = TTFont('/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc', fontNumber=2)
        sub = subset.Subsetter()
        sub.populate(text=book.text_content()+'半知免费书房精读手账馆原文中文对照词句摘录练习与回看参考思路轮到你了0123456789 /·')
        sub.subset(font)
        # Use a compact TrueType subset so all PDF renderers share the same glyph mapping.
        order = font.getGlyphOrder()
        glyphs = font.getGlyphSet()
        builder = FontBuilder(font['head'].unitsPerEm, isTTF=True)
        builder.setupGlyphOrder(order)
        builder.setupCharacterMap(font.getBestCmap())
        outlines = {}
        for name in order:
            pen = TTGlyphPen(None)
            glyphs[name].draw(Cu2QuPen(pen, 1, reverse_direction=True))
            outlines[name] = pen.glyph()
        builder.setupGlyf(outlines)
        builder.setupHorizontalMetrics(font['hmtx'].metrics)
        builder.setupHorizontalHeader(ascent=font['hhea'].ascent, descent=font['hhea'].descent)
        builder.setupNameTable({'familyName':'Noto Serif SC Study Subset','styleName':'Regular'})
        builder.setupOS2()
        builder.setupPost()
        path = Path(tmp)/'reading.ttf'
        builder.save(path)
        zh = pdf.Font(fontfile=str(path))
    doc = pdf.open()
    for number, chapter in enumerate(chapters, 1):
        page = doc.new_page(width=W, height=H)
        page.draw_rect(page.rect, fill=paper, color=None)
        label = chapter.xpath('.//*[@class="chapter"]')[0].text_content()
        line(page, margin, 37, '半知书房', zh, 10, muted)
        line(page, W-115, 37, 'READING ROOM', serif, 9, muted)
        page.draw_line((margin,49),(W-margin,49),color=(.75,.74,.67),width=.65)
        line(page, margin, 91, title, zh, 24)
        line(page, margin, 121, label, zh, 12, muted)
        y = 164
        content = chapter.xpath('.//*[@class="leaf-content"]')[0]
        for node in content:
            if node.tag == 'small': continue
            if node.get('class') == 'passage':
                y=paragraph(page,node.text_content(),serif,17.5,y)+19
            elif node.tag == 'details':
                page.draw_line((margin,y-9),(margin+32,y-9),color=muted,width=.8)
                y=paragraph(page,node.find('summary').text_content(),zh,11,y+12,muted)+6
                y=paragraph(page,node.find('p').text_content(),zh,14,y)
            elif node.tag == 'ul':
                for item in node:
                    y=paragraph(page,item.text_content(),zh,15,y)+15
            else:
                y=paragraph(page,node.text_content(),zh,16 if node.tag=='h3' else 14,y)+16
        if y>550: raise ValueError((slug,number,y))
        page.draw_line((margin,553),(W-margin,553),color=(.75,.74,.67),width=.65)
        line(page,margin,577,'精读手账馆',zh,10,muted)
        line(page,W-68,577,f'{number} / {len(chapters)}',serif,11,muted)
    doc.set_metadata({'title':title,'author':'半知精读教研团队','subject':'免费书房 · 精读手账'})

    doc.save(folder/'journal.pdf',garbage=4,deflate=True)
    doc.close()
    with pdf.open(folder/'journal.pdf') as source:
        for index,page in enumerate(source,1):
            pix = page.get_pixmap(matrix=pdf.Matrix(3,3), alpha=False)
            Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(folder/f'{index}.webp',quality=89,method=6)
    print(slug,len(chapters))
