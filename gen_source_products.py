import json, sys

def make_item(cid, name, name_cn, cat_apps, cat_apps_en, cat_desc, cat_desc_en, **kw):
    n = name_cn or name
    tags = [n[:15], name[:15]]
    apps = cat_apps if isinstance(cat_apps, list) else [cat_apps]
    apps_en = cat_apps_en if isinstance(cat_apps_en, list) else [cat_apps_en]
    desc = (n + cat_desc)[:100]
    den = (name + cat_desc_en)[:100]
    env_key = {"cultureMedium": None, "parentCell": None, "specs": None}
    return dict(id=cid, name=n, nameEn=name, description=desc, descriptionEn=den,
                tags=tags, tagsEn=[name[:15], cid], applications=apps, applicationsEn=apps_en,
                **{k: v for k, v in kw.items() if v and k in env_key})

data = json.load(open(r"C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\cobioer-products-all.json", "r", encoding="utf-8"))

cats = []
def add_cat(cid, title, title_en, desc, desc_en, icon, items, **kwargs):
    cats.append(dict(id=cid, title=title, titleEn=title_en, description=desc, descriptionEn=desc_en, icon=icon, items=items))

# Research Cells
rc_items = []
for d in data["researchCells"]:
    med = d.get("mediumInternal") or d.get("mediumOfficial") or ""
    rc_items.append(make_item(d["id"], d["name"], d.get("nameCn",""),
        ["肿瘤生物学","药物筛选","基因功能"], ["Cancer biology","Drug screening","Gene function"],
        "细胞系，"+d.get("source","")+"来源。", " cell line, sourced from "+d.get("source","")+".",
        cultureMedium=med))
add_cat("research-cells","科研细胞","Research Cell Lines","1200+株现货细胞库，覆盖人源、鼠源、猴源等","1200+ cell lines across species","Microscope",[{"id":"human-cell-lines","name":"人源细胞系","nameEn":"Human Cell Lines","description":"覆盖肺/肝/胃/乳腺/血液/神经等多种组织来源","descriptionEn":"Multi-tissue human cell lines","applications":["肿瘤生物学","药物筛选"],"applicationsEn":["Cancer biology","Drug screening"],"count":"1400+","products":rc_items}])

# GPCR
gp_items = []
for d in data["gpcr"]:
    app = d.get("application","")
    gp_items.append(make_item(d["id"], d["name"], d["name"],
        ["GPCR药物筛选","功能检测"], ["GPCR screening","Functional assay"],
        " GPCR稳定细胞株。"+app, " GPCR stable cell line. "+app,
        cultureMedium=d.get("medium","")))
add_cat("gpcr-targets","GPCR靶点细胞","GPCR Target Cells","GPCR药物筛选细胞平台","GPCR drug screening platform","Target",[{"id":"gpcr-cells","name":"GPCR靶点细胞","nameEn":"GPCR Target Cells","description":"覆盖A/B1/C类及孤儿GPCR","descriptionEn":"Class A/B1/C/Orphan GPCRs","products":gp_items}])

# Kinase
kn_items = []
for d in data["kinase"]:
    app = d.get("application","")
    kn_items.append(make_item(d["id"], d["name"], d["name"],
        ["激酶抑制剂筛选","药效评价"], ["Kinase screening","Efficacy"],
        " 激酶细胞。"+app, " kinase cell. "+app,
        cultureMedium=d.get("medium","")))
add_cat("kinase-cells","激酶靶点细胞","Kinase Target Cells","激酶抑制剂筛选平台","Kinase inhibitor screening platform","Target",[{"id":"kinase-cells","name":"激酶靶点细胞","nameEn":"Kinase Target Cells","products":kn_items}])

# Immunotherapy
im_items = []
for d in data["immunotherapy"]:
    im_items.append(make_item(d["id"], d["name"], d["name"],
        ["免疫治疗","抗体筛选","Fc效应"], ["Immunotherapy","Ab screening","Fc effector"],
        " 免疫治疗靶点细胞。", " immunotherapy target cell.",
        cultureMedium=d.get("medium","")))
add_cat("immunotherapy-cells","免疫治疗细胞","Immunotherapy Cells","免疫肿瘤药物开发细胞平台","Immuno-oncology drug development cells","Target",[{"id":"immunotherapy-cells","name":"免疫治疗细胞","nameEn":"Immunotherapy Cells","products":im_items}])

# TAA
ta_items = []
for d in data["taa"]:
    ta_items.append(make_item(d["id"], d["name"], d["name"],
        ["体内药效","免疫治疗评价","ADC开发"], ["In vivo efficacy","Immunotherapy","ADC"],
        " TAA小鼠模型细胞。", " TAA mouse model cell.",
        cultureMedium=d.get("medium",""), parentCell=d.get("parentCellName","")))
add_cat("taa-mouse","TAA小鼠模型","TAA Mouse Models","肿瘤相关抗原小鼠模型","Tumor-associated antigen mouse models","Target",[{"id":"taa-models","name":"TAA小鼠模型","nameEn":"TAA Mouse Models","products":ta_items}])

tracer_items = []
for d in data["tracer"]:
    tracer_items.append(make_item(d["id"], d["name"], d["name"],
        ["体内成像","肿瘤模型","药物分布"], ["In vivo imaging","Tumor model","Drug distribution"],
        " 示踪细胞，"+d.get("tissue","")+"组织。", " tracer cell, "+d.get("tissue","")+".",
        cultureMedium=d.get("medium","")))
add_cat("tracer-cells","示踪细胞","Tracer Cell Lines","Luciferase/GFP标记细胞，用于活体成像","Luciferase/GFP labeled cells for in vivo imaging","Target",[{"id":"tracer-luc","name":"示踪细胞","nameEn":"Tracer Cell Lines","products":tracer_items}])

dr_items = []
for d in data["drugResistant"]:
    drug_info = d.get("drug","")
    dr_items.append(make_item(d["id"], d["name"], d["name"],
        ["耐药机制","药物敏感性","联合用药"], ["Drug resistance","Drug sensitivity","Combination therapy"],
        " 耐药细胞株。"+drug_info, " drug-resistant cell line. "+drug_info,
        cultureMedium=d.get("medium","")))
add_cat("drug-resistant","耐药细胞","Drug-Resistant Cell Lines","耐药机制研究细胞模型","Drug resistance research cell models","Target",[{"id":"dr-cells","name":"耐药细胞株","nameEn":"Drug-Resistant Cells","products":dr_items}])

sp_items = []
for d in data["signalPathway"]:
    sp_items.append(make_item(d["id"], d["name"], d["name"],
        ["信号通路研究","药物筛选","机制研究"], ["Signaling","Drug screening","Mechanism"],
        " 信号通路报告细胞。", " signaling reporter cell.",
        cultureMedium=d.get("medium","")))
add_cat("signaling-pathway","信号通路细胞","Signaling Pathway Cells","信号通路报告细胞平台","Signaling reporter cell platform","Target",[{"id":"signaling-cells","name":"信号通路细胞","nameEn":"Signaling Pathway Cells","products":sp_items}])

nr_items = []
for d in data["nuclearReceptor"]:
    nr_items.append(make_item(d["id"], d["name"], d["name"],
        ["核受体研究","内分泌","代谢疾病"], ["Nuclear receptor","Endocrine","Metabolic disease"],
        " 核受体细胞株。", " nuclear receptor cell line.",
        cultureMedium=d.get("medium","")))
add_cat("nuclear-receptor","核受体细胞","Nuclear Receptor Cells","核受体药物筛选细胞","Nuclear receptor drug screening cells","Target",[{"id":"nr-cells","name":"核受体细胞","nameEn":"Nuclear Receptor Cells","products":nr_items}])

os_items = []
for d in data["otherStable"]:
    cls = d.get("classLevel2","")
    os_items.append(make_item(d["id"], d["name"], d["name"],
        ["稳定表达","蛋白生产","抗体开发"], ["Stable expression","Protein production","Ab development"],
        " 稳定表达细胞株。"+cls, " stable expression cell line. "+cls,
        cultureMedium=d.get("medium","")))
add_cat("other-stable","其他稳定株","Other Stable Cell Lines","稳定表达及抗体开发细胞","Stable expression and antibody development cells","Target",[{"id":"stable-lines","name":"其他稳定株","nameEn":"Other Stable Lines","products":os_items}])

total = sum(sum(len(s.get("products",[])) for s in c["items"]) for c in cats)
print(f"Generated {len(cats)} categories, {total} products")

with open("src/data/products.json","w",encoding="utf-8") as f:
    json.dump(cats, f, ensure_ascii=False, indent=2)

import os
size = os.path.getsize("src/data/products.json")
print(f"File size: {size//1024} KB")
