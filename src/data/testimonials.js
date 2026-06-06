const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    nameHi: 'राहुल शर्मा',
    nameMr: 'राहुल शर्मा',
    location: 'Alandi',
    rating: 5,
    text: 'Best place for electronics in Alandi! I bought a Samsung TV and the price was better than any other shop in Pune. Very helpful staff.',
    textHi: 'आलंदी में इलेक्ट्रॉनिक्स के लिए सबसे अच्छी जगह! मैंने Samsung TV खरीदा और कीमत पुणे की किसी भी दुकान से बेहतर थी। बहुत मददगार स्टाफ।',
    textMr: 'आळंदीत इलेक्ट्रॉनिक्ससाठी सर्वोत्तम जागा! मी Samsung TV विकत घेतला आणि किंमत पुण्यातील कोणत्याही दुकानापेक्षा चांगली होती. खूप मदत करणारा स्टाफ.',
    date: '2025-12-15'
  },
  {
    id: 2,
    name: 'Priya Deshmukh',
    nameHi: 'प्रिया देशमुख',
    nameMr: 'प्रिया देशमुख',
    location: 'Chakan',
    rating: 5,
    text: 'Excellent service! We bought a complete home appliance package for our new house. They gave us a great discount and delivered everything on time.',
    textHi: 'उत्कृष्ट सेवा! हमने अपने नए घर के लिए पूरा होम एप्लायंस पैकेज खरीदा। उन्होंने हमें बहुत अच्छी छूट दी और समय पर सब कुछ डिलीवर किया।',
    textMr: 'उत्कृष्ट सेवा! आम्ही आमच्या नवीन घरासाठी संपूर्ण होम अप्लायन्स पॅकेज विकत घेतले. त्यांनी आम्हाला खूप चांगली सूट दिली आणि वेळेवर सर्व काही डिलिव्हर केले.',
    date: '2025-11-20'
  },
  {
    id: 3,
    name: 'Amit Joshi',
    nameHi: 'अमित जोशी',
    nameMr: 'अमित जोशी',
    location: 'Alandi',
    rating: 5,
    text: 'The best AC dealer in Alandi! I have purchased 3 ACs from them over the years. Installation was professional and after-sales support is excellent.',
    textHi: 'आलंदी में सबसे अच्छा AC डीलर! मैंने पिछले कुछ वर्षों में उनसे 3 AC खरीदे हैं। इंस्टॉलेशन पेशेवर था और बिक्री के बाद का सपोर्ट उत्कृष्ट है।',
    textMr: 'आळंदीत सर्वोत्तम AC डीलर! मी गेल्या काही वर्षांत त्यांच्याकडून 3 AC विकत घेतले आहेत. इन्स्टॉलेशन व्यावसायिक होते आणि विक्रीनंतरचा सपोर्ट उत्कृष्ट आहे.',
    date: '2025-10-05'
  },
  {
    id: 4,
    name: 'Sneha Patil',
    nameHi: 'स्नेहा पाटिल',
    nameMr: 'स्नेहा पाटील',
    location: 'Pune',
    rating: 5,
    text: 'Highly recommend Hari Om Electronics! They have a great range of products and the staff is very knowledgeable. Found exactly what I needed for my kitchen.',
    textHi: 'हरि ओम इलेक्ट्रॉनिक्स की अत्यधिक अनुशंसा करता हूं! उनके पास उत्पादों की एक शानदार श्रृंखला है और स्टाफ बहुत जानकार है। मुझे अपनी रसोई के लिए वही मिला जो मुझे चाहिए था।',
    textMr: 'हरी ओम इलेक्ट्रॉनिक्सची अत्यंत शिफारस करतो! त्यांच्याकडे उत्पादनांची उत्तम श्रेणी आहे आणि स्टाफ खूप जाणकार आहे. मला माझ्या स्वयंपाकघरासाठी नक्की काय हवे होते ते सापडले.',
    date: '2025-09-12'
  },
  {
    id: 5,
    name: 'Vikas More',
    nameHi: 'विकास मोरे',
    nameMr: 'विकास मोरे',
    location: 'Alandi',
    rating: 5,
    text: 'Bought a washing machine from here. Great price, smooth delivery, and they even helped with the old machine removal. Very happy with the service!',
    textHi: 'यहां से वॉशिंग मशीन खरीदी। बढ़िया कीमत, सुचारू डिलीवरी, और उन्होंने पुरानी मशीन हटाने में भी मदद की। सेवा से बहुत खुश हूं!',
    textMr: 'इथून वॉशिंग मशीन विकत घेतली. उत्तम किंमत, सुलभ डिलिव्हरी, आणि त्यांनी जुन्या मशीन काढण्यातही मदत केली. सेवेबद्दल खूप आनंद आहे!',
    date: '2025-08-28'
  },
  {
    id: 6,
    name: 'Neha Kulkarni',
    nameHi: 'नेहा कुलकर्णी',
    nameMr: 'नेहा कुलकर्णी',
    location: 'Pimpri',
    rating: 5,
    text: 'Amazing experience! The staff at Hari Om Electronics helped me choose the perfect refrigerator for my family. They explained everything in detail and didn\'t push any expensive models.',
    textHi: 'अद्भुत अनुभव! हरि ओम इलेक्ट्रॉनिक्स के स्टाफ ने मेरे परिवार के लिए सही रेफ्रिजरेटर चुनने में मेरी मदद की। उन्होंने सब कुछ विस्तार से समझाया और कोई महंगा मॉडल नहीं बताया।',
    textMr: 'अद्भुत अनुभव! हरी ओम इलेक्ट्रॉनिक्सच्या स्टाफने माझ्या कुटुंबासाठी योग्य रेफ्रिजरेटर निवडण्यास मदत केली. त्यांनी सर्व काही तपशीलवार सांगितले आणि कोणतेही महाग मॉडेल ढकलले नाही.',
    date: '2025-07-15'
  },
  {
    id: 7,
    name: 'Sagar Jadhav',
    nameHi: 'सागर जाधव',
    nameMr: 'सागर जाधव',
    location: 'Alandi',
    rating: 5,
    text: 'Go-to shop for all electronics needs. Fair prices, genuine products, and trustworthy service. The team goes out of their way to satisfy customers.',
    textHi: 'सभी इलेक्ट्रॉनिक्स जरूरतों के लिए सबसे अच्छी दुकान। उचित मूल्य, असली उत्पाद और भरोसेमंद सेवा। टीम ग्राहकों को संतुष्ट करने के लिए हर संभव प्रयास करती है।',
    textMr: 'सर्व इलेक्ट्रॉनिक्स गरजांसाठी उत्तम दुकान. योग्य किमती, खरी उत्पादने आणि विश्वासार्ह सेवा. टीम ग्राहकांना समाधानी करण्यासाठी सर्वतोपरी प्रयत्न करते.',
    date: '2025-06-20'
  },
  {
    id: 8,
    name: 'Anita Dhamale',
    nameHi: 'अनीता धमाले',
    nameMr: 'अनिता धमाले',
    location: 'Chakan',
    rating: 5,
    text: 'We purchased all our home appliances from Hari Om Electronics for our new home. From TV to mixer, everything was delivered promptly. Excellent experience!',
    textHi: 'हमने अपने नए घर के लिए हरि ओम इलेक्ट्रॉनिक्स से सभी घरेलू उपकरण खरीदे। TV से मिक्सर तक, सब कुछ समय पर डिलीवर हुआ। उत्कृष्ट अनुभव!',
    textMr: 'आम्ही आमच्या नवीन घरासाठी हरी ओम इलेक्ट्रॉनिक्सकडून सर्व घरगुती उपकरणे विकत घेतली. TV पासून मिक्सरपर्यंत, सर्व काही वेळेवर डिलिव्हर झाले. उत्कृष्ट अनुभव!',
    date: '2025-05-10'
  }
]

export default testimonials
