// Default seed content. Real facts only - numbers here are either standard product
// category values (ESD surface resistance ranges per IEC 61340) or ESDA-published
// industry statistics (marked with Source). Company-specific numbers stay as
// "TBC" placeholders for the admin to fill in.

export const SITE = {
  brand: 'MacroESD',
  company_legal: 'Shanghai MACO ESD Technology Co., Ltd.',
  whatsapp: '+8613381873839',
  email: 'zhaojiegang52257@gmail.com',
  address: 'Shanghai, China',
  wa_msg_default: 'Hi MacroESD, I saw your ESD packaging page. I would like a quote for ESD corrugated plastic boxes.'
};
export const TRACKING = { meta_pixel_id: '', meta_test_event_code: '', meta_capi_token: '', ga4_id: '' };

export const HOMEPAGE = {
  hero_eyebrow: 'ESD Packaging Solutions for Electronics Manufacturing',
  hero_title: 'ESD Corrugated Plastic Boxes, Built Around Your PCB',
  hero_title_vi: 'Thùng nhựa rỗng ESD tùy chỉnh cho sản xuất điện tử',
  hero_sub: 'Custom ESD packaging designed to protect your products, reduce packaging costs and improve reusable logistics.',
  hero_sub_vi: 'Bao bì ESD tùy chỉnh giúp bảo vệ sản phẩm, giảm chi phí đóng gói và tối ưu vận chuyển tái sử dụng.',
  why_items: [
    { en: 'Custom Manufacturing|Boxes built to your product dimensions, not standard sizes.', vi: 'Sản xuất tùy chỉnh|Thùng theo kích thước sản phẩm của bạn.' },
    { en: 'ESD Protection|Conductive and static-dissipative options, tested to IEC 61340-5-1 conditions.', vi: 'Bảo vệ ESD|Tùy chọn dẫn điện / tiêu tán tĩnh điện.' },
    { en: 'Custom Divider Design|Long / short dividers and grid layouts for PCB and component separation.', vi: 'Vách ngăn tùy chỉnh|Cho PCB và linh kiện.' },
    { en: 'Reusable Packaging|PP hollow sheet boxes engineered for repeated return-trip logistics.', vi: 'Tái sử dụng|Nhựa PP rỗng cho logistics tuần hoàn.' },
    { en: 'Packaging Cost Reduction|Replace single-use cartons with returnable ESD boxes - cost per turnover drops.', vi: 'Giảm chi phí|Thùng tuần hoàn thay thùng giấy dùng một lần.' },
    { en: 'Quality Control|ESD surface resistance checked per batch.', vi: 'Kiểm soát chất lượng|Đo điện trở bề mặt theo lô.' },
    { en: 'Factory-Network Pricing|One trusted contact across specialized ESD partner factories - factory-level pricing and fast customization.', vi: 'Giá từ nhà máy đối tác|Một đầu mối qua các nhà máy ESD chuyên biệt.' },
    { en: 'Export Support|Export documentation and packaging for international shipping.', vi: 'Hỗ trợ xuất khẩu|Chứng từ xuất khẩu.' }
  ],
  apps_items: ['PCB manufacturing', 'SMT assembly', 'Electronics assembly (EMS)', 'Automotive electronics', 'Semiconductor & components', 'Cleanroom handling'],
  factory_text: 'Photos of production at our partner plants - sheet extrusion, cutting / welding and divider assembly - are uploaded from the Admin panel. Real factory images only.',
  final_title: 'Get a custom ESD packaging proposal in 1 business day',
  final_text: 'Send sizes, quantity and application - we will recommend structure, divider layout and material.',
  show_cases: true, show_faq: true
};

export const ABOUT = {
  company_intro: 'TBC - company profile to be filled by admin (founding year, factory area, capacity: real data only).',
  factory_text: 'TBC - describe the real factory, machines and monthly capacity in Admin.',
  quality_text: 'Products are produced to IEC 61340-5-1 ESD requirements. Third-party testing reports can be arranged on request (cost and lead time to be confirmed).',
  export_text: 'We support export packaging and documentation for Southeast Asia and global destinations.',
  certificates: ['Produced to IEC 61340-5-1 / ANSI-ESD S20.20 requirements; third-party testing can be arranged on request', 'More certificates to be added by admin - real only']
};

export const CATEGORIES = [
  { slug: 'corrugated-boxes', name_en: 'ESD Corrugated Plastic Boxes', name_vi: 'Thùng nhựa rỗng ESD', sort_order: 1 },
  { slug: 'injection-boxes', name_en: 'ESD Injection Molded Boxes', name_vi: 'Thùng nhựa ESD đúc', sort_order: 2 },
  { slug: 'chairs-mats', name_en: 'ESD Chairs & Mats', name_vi: 'Ghế & thảm ESD', sort_order: 3 },
  { slug: 'other-esd', name_en: 'Other ESD Products', name_vi: 'Sản phẩm ESD khác', sort_order: 4 }
];

const B = (en, vi) => ({ en, vi });

export const PRODUCTS = [
  {
    slug: 'esd-corrugated-plastic-box', category_slug: 'corrugated-boxes', is_core: true, show_divider: true,
    rfq_kind: 'corrugated', sort_order: 1, status: 'published',
    name_en: 'ESD Corrugated Plastic Box', name_vi: 'Thùng nhựa rỗng ESD',
    short_en: 'Custom reusable ESD packaging for PCB, SMT and electronics manufacturing.',
    short_vi: 'Bao bì ESD tái sử dụng tùy chỉnh cho PCB, SMT và sản xuất điện tử.',
    intro_en: 'Our core product: reusable ESD boxes made from conductive PP hollow (corrugated) sheet, welded and cut to your exact dimensions.\nDesigned around your PCB or component layout - divider grids, foam padding slots, label pockets, foldable lids and returnable logistics are all engineering options, not accessories.\nOne tooling-free box system can replace single-use cartons and expensive plastic crates across your production loop.',
    intro_vi: 'Sản phẩm cốt lõi: thùng tái sử dụng từ nhựa PP rỗng dẫn điện, cắt hàn theo kích thước yêu cầu.\nThiết kế theo bố cục PCB / linh kiện: vách ngăn, lớp mút, nắp gập, logistics tuần hoàn.\nMột hệ thống thùng có thể thay thế thùng giấy dùng một lần và khay nhựa đắt tiền.',
    benefits: [
      B('Custom size - any dimension, no mold needed', 'Kích thước tùy chỉnh, không cần khuôn'),
      B('Custom divider - grid / long / short layout for each product', 'Vách ngăn tùy chỉnh cho từng sản phẩm'),
      B('ESD protection - conductive or static-dissipative', 'Chống tĩnh điện - dẫn điện hoặc tiêu tán'),
      B('Reusable - built for return-trip logistics', 'Tái sử dụng cho vòng tuần hoàn'),
      B('Foldable - save 70%+ return freight and warehouse space', 'Gập gọn - tiết kiệm không gian'),
      B('Lightweight - easier handling than crates', 'Nhẹ hơn khay đúc'),
      B('Lower cost per turnover than single-use cartons', 'Chi phí mỗi vòng thấp hơn thùng giấy')
    ],
    features: [
      B('Material: conductive PP hollow sheet (carbon-black filled)', 'Vật liệu: PP rỗng dẫn điện'),
      B('Surface resistance: 10^3-10^5 Ω/sq conductive, 10^6-10^9 Ω/sq dissipative (per IEC 61340 test method)', 'Điện trở bề mặt theo IEC 61340'),
      B('Thickness 2-10 mm, colors: black standard, custom colors on request', 'Độ dày 2-10 mm'),
      B('Welded corners, reinforced edge options, metal/plastic handles', 'Hàn nhiệt, tay cầm'),
      B('Options: lid, label pocket, foam/EVA insert, stacking', 'Nắp, khay mút/EVA, xếp chồng')
    ],
    specs: [
      { label: 'Length', value: 'Custom (typical 200-800 mm)' },
      { label: 'Width', value: 'Custom' },
      { label: 'Height', value: 'Custom' },
      { label: 'Material', value: 'Conductive PP hollow/corrugated sheet' },
      { label: 'Thickness', value: '2-10 mm by size & load' },
      { label: 'Color', value: 'Black; custom on request' },
      { label: 'ESD performance', value: '10^3-10^9 Ω/sq (conductive / dissipative)' },
      { label: 'Divider', value: 'Long / short / grid, removable options' },
      { label: 'Load capacity', value: 'By size - confirm with our engineers' },
      { label: 'Custom options', value: 'Lid, handles, label pocket, EVA/foam insert, printing' }
    ],
    applications: ['PCB storage & transport', 'SMT trays & feeders', 'Electronic components', 'Automotive electronics', 'Semiconductor wafers handling', 'Cleanroom internal logistics'],
    use_cases: [
      B('PCB returnable packaging between plants', 'Thu hồi PCB giữa các nhà máy'),
      B('SMT production line feeding & WIP storage', 'Line SMT và bán thành phẩm'),
      B('Component segregation with grid dividers', 'Phân loại linh kiện bằng vách lưới')
    ],
    seo_title: 'Custom ESD Corrugated Plastic Boxes for PCB & SMT | MacroESD',
    seo_desc: 'Reusable ESD corrugated plastic (PP hollow sheet) boxes with custom size and dividers for PCB, SMT and electronics manufacturing. Factory-direct pricing, export support.'
  },
  {
    slug: 'esd-injection-molded-box', category_slug: 'injection-boxes', is_core: false,
    rfq_kind: 'injection', sort_order: 2, status: 'published',
    name_en: 'ESD Injection Molded Box', name_vi: 'Thùng nhựa ESD đúc',
    short_en: 'Durable standardized ESD containers for long-term use in electronics manufacturing.',
    short_vi: 'Thùng ESD đúc chắc chắn, tiêu chuẩn hóa cho sử dụng dài hạn.',
    intro_en: 'Heavy-duty injection-molded ESD containers for fixed-SKU, long-cycle logistics - stackable, robust and standardized.\nChoose injection boxes when you need identical reusable containers across plants and long service life; choose corrugated boxes when sizes change often or you need custom dividers fast.',
    intro_vi: 'Thùng đúc ESD chịu lực cho logistics SKU cố định - xếp chồng, bền, tiêu chuẩn.',
    benefits: [B('Durable', 'Bền'), B('Reusable for years', 'Dùng nhiều năm'), B('ESD protection', 'Chống ESD'), B('Standardized sizes', 'Kích thước chuẩn'), B('Stackable', 'Xếp chồng'), B('Long service life', 'Tuổi thọ cao')],
    features: [B('Materials: conductive PP/PE injection grade', 'Nhựa đúc dẫn điện PP/PE'), B('Surface resistance per IEC 61340 range', 'Điện trở bề mặt theo IEC 61340')],
    specs: [
      { label: 'Sizes', value: 'Standard series + custom mold projects' },
      { label: 'Material', value: 'Conductive PP / PE' },
      { label: 'ESD performance', value: '10^3-10^9 Ω/sq' },
      { label: 'Load capacity', value: 'Model dependent' }
    ],
    applications: ['Electronics manufacturing', 'Component storage', 'In-plant logistics'],
    use_cases: [],
    seo_title: 'ESD Injection Molded Boxes | MacroESD',
    seo_desc: 'Durable reusable ESD injection molded containers for electronics manufacturing.'
  },
  {
    slug: 'esd-chairs', category_slug: 'chairs-mats', is_core: false,
    rfq_kind: 'chair', sort_order: 3, status: 'published',
    name_en: 'ESD Chair', name_vi: 'Ghế ESD',
    short_en: 'Anti-static work chairs for SMT lines, assembly benches and ESD controlled areas.',
    short_vi: 'Ghế chống tĩnh điện cho line SMT và khu vực kiểm soát ESD.',
    intro_en: 'ESD work chairs with dissipative upholstery and grounded caster options for protected areas. Low MOQ and custom configurations available.',
    intro_vi: 'Ghế ESD với vật liệu tiêu tán và bánh xe nối đất.',
    benefits: [B('Dissipative surface', 'Bề mặt tiêu tán'), B('Grounding via chain/caster', 'Nối đất'), B('Adjustable options', 'Tùy chỉnh')],
    features: [], specs: [
      { label: 'Surface resistance', value: '10^6-10^9 Ω' },
      { label: 'Frame', value: 'Steel, chrome or plastic' },
      { label: 'Options', value: 'Backrest, height adjust, PU casters' }
    ],
    applications: ['SMT lines', 'Assembly stations', 'Inspection benches'],
    use_cases: [],
    seo_title: 'ESD Chairs for Electronics Workstations | MacroESD',
    seo_desc: 'Anti-static work chairs for ESD protected areas.'
  },
  {
    slug: 'esd-mats', category_slug: 'chairs-mats', is_core: false,
    rfq_kind: 'mat', sort_order: 4, status: 'published',
    name_en: 'ESD Workbench Mat', name_vi: 'Thảm bàn làm việc ESD',
    short_en: 'Two-layer dissipative desk mats with grounding system for workbenches and benches.',
    short_vi: 'Thảm bàn ESD hai lớp kèm hệ thống nối đất.',
    intro_en: 'Two-layer rubber ESD mats (dissipative top, conductive bottom) with snap and ground cord. Custom sizes - exact parameters maintained in the Admin panel.',
    intro_vi: 'Thảm cao su ESD hai lớp, kèm dây nối đất. Kích thước tùy chỉnh.',
    benefits: [B('Two-layer structure', 'Hai lớp'), B('Grounding kit included', 'Kèm dây nối đất'), B('Custom size', 'Kích thước tùy chỉnh')],
    features: [], specs: [
      { label: 'Thickness', value: 'TBC in admin' },
      { label: 'Sizes', value: 'Custom / standard rolls' },
      { label: 'Color', value: 'Blue/grey typical' }
    ],
    applications: ['Workbenches', 'Bench packaging areas'],
    use_cases: [],
    seo_title: 'ESD Workbench Mats | MacroESD', seo_desc: 'Anti-static desk mats with grounding for electronics workstations.'
  },
  {
    slug: 'other-esd-products', category_slug: 'other-esd', is_core: false,
    rfq_kind: 'other', sort_order: 5, status: 'published',
    name_en: 'Other ESD Products', name_vi: 'Sản phẩm ESD khác',
    short_en: 'ESD trays, garments, gloves and more - ask us.',
    short_vi: 'Khay ESD, đồ chống tĩnh điện, găng tay và hơn nữa.',
    intro_en: 'We also supply ESD trays, garments, shoes, gloves and other EPA consumables. Tell us what you need and we will quote.',
    intro_vi: 'Chúng tôi cung cấp thêm khay, đồ, găng tay ESD.',
    benefits: [], features: [], specs: [],
    applications: ['ESD trays', 'ESD garments', 'ESD gloves', 'ESD shoes'],
    use_cases: [],
    seo_title: 'Other ESD Products | MacroESD', seo_desc: 'Additional ESD products for your EPA.'
  }
];

export const SOLUTIONS = [
  {
    slug: 'pcb-packaging', sort_order: 1, status: 'published',
    title_en: 'PCB Packaging & Returnable Logistics', title_vi: 'Giải pháp bao bì PCB',
    subtitle_en: 'Storage, handling and transportation of PCBs under ESD control',
    intro_en: 'Bare PCBs are vulnerable to ESD damage, scratching and moisture during handling between process steps, plants and suppliers.\nOur ESD corrugated boxes with vertical divider grids hold boards securely edge-up, keep different lots separated, and fold flat for the return trip - replacing mixed single-use packaging with one standard system.',
    intro_vi: 'PCB dễ bị hư hại do tĩnh điện và trầy xước trong vận chuyển. Thùng ESD với vách ngăn giữ PCB đứng, phân lô và gập gọn khi thu hồi.',
    points: [
      B('PCB storage & WIP protection', 'Lưu trữ PCB'),
      B('Safe handling between stations', 'Vận chuyển giữa các công đoạn'),
      B('Inter-plant transportation', 'Vận chuyển giữa nhà máy'),
      B('ESD protection with verified surface resistance', 'Kiểm soát ESD'),
      B('Product separation with custom dividers', 'Phân lô bằng vách ngăn'),
      B('Reusable returnable logistics', 'Logistics tuần hoàn')
    ],
    seo_title: 'PCB ESD Packaging Solutions | MacroESD',
    seo_desc: 'Reusable ESD boxes with divider grids for PCB storage, handling and transport.'
  },
  {
    slug: 'smt-packaging', sort_order: 2, status: 'published',
    title_en: 'SMT Packaging', title_vi: 'Bao bì cho SMT',
    subtitle_en: 'Feeder, tray and component logistics for SMT lines',
    intro_en: 'SMT lines need components and boards moved constantly - feeders, trays and WIP boards all need ESD-safe, well-segregated carriers.\nWe build box-and-divider systems sized to your tray footprints and reel boxes so one container fits your line, your racks and your return logistics.',
    intro_vi: 'Line SMT cần khay, feeder và linh kiện được phân loại và bảo vệ ESD. Chúng tôi thiết kế thùng theo khay thực tế của bạn.',
    points: [
      B('Feeder & reel transport boxes', 'Thùng chứa feeder/reel'),
      B('Tray-sized divider grids', 'Vách theo khay'),
      B('WIP board carriers', 'Khay PCB bán thành phẩm'),
      B('Label pockets for traceability', 'Túi nhãn truy xuất')
    ],
    seo_title: 'SMT ESD Packaging | MacroESD', seo_desc: 'Custom ESD boxes and dividers for SMT production lines.'
  },
  {
    slug: 'electronics-manufacturing', sort_order: 3, status: 'published',
    title_en: 'Electronics Manufacturing', title_vi: 'Sản xuất điện tử',
    subtitle_en: 'ESD packaging and workstation environment',
    intro_en: 'Beyond boxes, a working EPA (ESD protected area) needs consistent control of how products are packed, moved and handled.\nWe supply the packaging and handling layer: ESD boxes, trays, chairs and bench mats - one supplier, consistent resistance ranges, simpler auditing.',
    intro_vi: 'Ngoài thùng ESD, khu vực EPA cần kiểm soát đồng bộ. Chúng tôi cung cấp thùng, khay, ghế và thảm bàn - một nhà cung cấp, dễ kiểm toán.',
    points: [
      B('One-stop ESD packaging & handling', 'Một nhà cung cấp'),
      B('Consistent resistance specs across items', 'Thông số đồng nhất'),
      B('Simpler supplier audits', 'Dễ kiểm toán')
    ],
    seo_title: 'ESD Solutions for Electronics Manufacturing | MacroESD',
    seo_desc: 'ESD boxes, trays, chairs and mats for electronics factories.'
  }
];

export const FAQS = [
  {
    q_en: 'Can you make boxes in completely custom sizes?', a_en: 'Yes. Our corrugated (hollow sheet) boxes are cut and welded from sheet - any size, no mold required. Send us your product dimensions and we will propose the box and divider layout.',
    q_vi: 'Có nhận làm kích thước tùy chỉnh không?', a_vi: 'Có. Thùng nhựa rỗng được cắt hàn theo yêu cầu, không cần khuôn.',
    category: 'product', product_slug: 'esd-corrugated-plastic-box', sort_order: 1
  },
  {
    q_en: 'What is the MOQ?', a_en: 'For new customers there is no fixed MOQ - we start from small trial batches, and price improves with volume.',
    q_vi: 'MOQ là bao nhiêu?', a_vi: 'Khách hàng mới không có MOQ cố định, đơn thử nghiệm số lượng nhỏ được hỗ trợ.',
    category: 'general', sort_order: 2
  },
  {
    q_en: 'How do I choose conductive vs static-dissipative material?', a_en: 'It depends on your ESD control plan and the sensitivity of what you pack. Conductive (10^3-10^5 Ω/sq) is common for PCB transport; dissipative (10^6-10^9 Ω/sq) is often used in the work area. Tell us your standard (e.g. IEC 61340 / ANSI-ESD S20.20) and we will match it.',
    q_vi: 'Chọn vật liệu dẫn điện hay tiêu tán thế nào?', a_vi: 'Tùy kế hoạch kiểm soát ESD của bạn. Hãy cho chúng tôi tiêu chuẩn bạn đang áp dụng.',
    category: 'product', sort_order: 3
  },
  {
    q_en: 'Do you provide ESD test reports?', a_en: 'Products are produced to IEC 61340-5-1 ESD requirements. If you need a formal third-party test report, we can arrange testing on your behalf (cost and lead time to be confirmed).',
    q_vi: 'Có báo cáo test ESD không?', a_vi: 'Sản phẩm được sản xuất theo yêu cầu IEC 61340-5-1. Nếu cần báo cáo thử nghiệm bên thứ ba, chúng tôi có thể sắp xếp gửi kiểm định.',
    category: 'company', sort_order: 4
  },
  {
    q_en: 'How long is production lead time?', a_en: 'It depends on size, structure and quantity. After we receive your dimensions and quantity, we confirm the exact lead time in the quotation.',
    q_vi: 'Thời gian sản xuất bao lâu?', a_vi: 'Tùy kích thước và số lượng; chúng tôi xác nhận trong báo giá.',
    category: 'logistics', sort_order: 5
  },
  {
    q_en: 'Can you ship to Vietnam / Southeast Asia?', a_en: 'Yes - we support export documentation and arrange shipping for Southeast Asia. For nearby regions small trial orders can also go by express.',
    q_vi: 'Có giao hàng Việt Nam / Đông Nam Á không?', a_vi: 'Có - hỗ trợ chứng từ xuất khẩu.',
    category: 'logistics', sort_order: 6
  },
  {
    q_en: 'Are samples available?', a_en: 'Yes. For standard structures sample programs can be arranged; for custom designs we usually produce a first article before series production.',
    q_vi: 'Có hàng mẫu không?', a_vi: 'Có.',
    category: 'general', sort_order: 7
  }
];

// ---- Ad landing page: the money loop page for FB campaigns ----
export const LANDING_ESD_BOX = {
  slug: 'esd-box-solution', name: 'ESD Box - main ad landing', status: 'published',
  seo_title: 'Stop Buying Disposable Cartons - Switch to Reusable ESD Boxes | MacroESD',
  seo_desc: 'Custom reusable ESD corrugated boxes for PCB & SMT factories. Cut packaging cost per turnover. Factory-direct pricing, 1-day quote.',
  blocks: [
    {
      type: 'hero',
      eyebrow: 'For PCB / SMT factories',
      title: 'You are wasting about $6,000 a year on disposable cartons.',
      title_vi: 'Bạn đang đốt ~6.000 USD/năm vì thùng giấy dùng một lần.',
      sub: 'Based on a conservative 500-box loop: cardboard lasts 1-3 trips, our ESD hollow-sheet box lasts 30-50. Same protection, about 1/5 the cost per turnover.',
      sub_vi: 'Ước tính vòng 500 thùng: thùng giấy dùng 1-3 lần, thùng ESD nhựa rỗng dùng 30-50 lần.',
      image: 'product:esd-corrugated-plastic-box'
    },
    {
      type: 'text',
      title: 'The damage you do not see',
      lines: [
        'ESD damage is invisible until your customer finds it. Industry data published by ESDA estimates that 8-33% of electronic component damage is ESD-related, up to 25% of field failures of large electronic systems have been attributed to ESD, and roughly 90% of ESD damage is a latent defect that passes final test.',
        'A failed board found at the customer can cost 10-50x more than at your line. Your packaging is part of that risk - or part of the control.',
        'Source: ESDA (ESD Association) published industry statistics.'
      ],
      lines_vi: [
        'Hư hại ESD không nhìn thấy được. Theo ESDA, 8-33% hư hại linh kiện điện tử liên quan ESD; khoảng 90% là lỗi tiềm ẩn qua được test cuối.',
        'Nguồn: số liệu công bố của ESDA.'
      ]
    },
    {
      type: 'benefits',
      title: 'One box system replaces the carton chaos',
      items: [
        B('Custom size + divider grid for each PCB model', 'Kích thước & vách ngăn theo từng model PCB'),
        B('Conductive / dissipative, IEC 61340 tested', 'Được đo kiểm theo IEC 61340'),
        B('Foldable - 70%+ space back on return trips', 'Gập gọn khi thu hồi'),
        B('30-50 turnover cycles vs 1-3 for cartons', '30-50 vòng so với 1-3 vòng thùng giấy'),
        B('Label pockets for lot traceability', 'Túi nhãn truy xuất lô'),
        B('No mold needed - any size, fast changes', 'Không cần khuôn')
      ]
    },
    { type: 'product', slug: 'esd-corrugated-plastic-box' },
    {
      type: 'proof',
      title: 'Why factories buy direct from us',
      items: [
        B('Dedicated partner plants - sheet, cutting and welding under one QC standard', 'Nhà máy đối tác chuyên biệt'),
        B('No fixed MOQ for new customers - start with a trial batch', 'Không MOQ cố định cho đơn thử'),
        B('Quote within 1 business day with divider proposal', 'Báo giá trong 1 ngày làm việc')
      ]
    },
    { type: 'image', owner_key: 'esd-box-solution', alt: 'Factory photos uploaded from admin' },
    { type: 'faq', category: 'product' },
    { type: 'form', title: 'Get your custom box proposal', sub: 'Send sizes & quantity - we propose structure, divider layout and material.' },
    { type: 'cta', title: 'Prefer to talk now?', text: 'Message our engineers directly on WhatsApp.', button: 'Chat on WhatsApp' }
  ]
};
