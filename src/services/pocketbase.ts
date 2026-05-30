import PocketBase from 'pocketbase';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tagline: string;
  subcategory?: string;
  customizationOptions?: {
    title: string;
    options: string[];
    multiSelect?: boolean;
  }[];
}

export interface Order {
  id: string;
  tableNumber: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: string[];
    specialInstructions?: string;
  }[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'served';
  created: string;
}

// Initializing pocketbase client
const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
export const pb = new PocketBase(pbUrl);

// Premium Mock Menu Data reflecting the exact Dashboard Categories & Subcategories
export const MOCK_MENU: MenuItem[] = [
  // 1. Breakfast Subcategories: Maggi, Burger, Mumbai Special, Tea Snacks, grocery
  {
    id: 'b-maggi-1',
    name: 'Cheese Butter Veg Maggi',
    description: 'Freshly cooked masala instant noodles loaded with sautéed carrots, peas, double butter, and premium melted mozzarella cheese.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
    tagline: 'QUICK & SPICY',
    subcategory: 'Maggi',
    customizationOptions: [
      { title: 'Spice Level', options: ['Regular Masala', 'Extra Hot Chili', 'Mild'] },
      { title: 'Extras', options: ['Double Cheese (+₹25)', 'Extra Butter (+₹15)'], multiSelect: true }
    ]
  },
  {
    id: 'b-burger-1',
    name: 'Aloo Tikki Supreme Burger',
    description: 'Crispy herb-potato patty layered with fresh onions, ripe tomatoes, spicy garlic mayo, and green lettuce in warm toasted sesame buns.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
    tagline: 'GRILLED BUNS',
    subcategory: 'Burger',
    customizationOptions: [
      { title: 'Cheese', options: ['Standard Burger', 'Add Cheese Slice (+₹15)', 'Double Cheese (+₹30)'] }
    ]
  },
  {
    id: 'b-mumbai-1',
    name: 'Mumbai Special Vada Pav',
    description: 'Authentic Maharashtrian street style. Two golden spiced potato dumplings inside fresh pav buns, laced with wet mint and dry garlic chutneys.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
    tagline: 'STREET LEGEND',
    subcategory: 'Mumbai Special',
    customizationOptions: [
      { title: 'Chili', options: ['Fried Green Chili on Side', 'No Green Chili'] }
    ]
  },
  {
    id: 'b-snacks-1',
    name: 'Golden Paneer Pakoda',
    description: 'Crispy batter-fried paneer cubes sandwiched with green mint chutney, dipped in fresh chickpea flour batter.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
    tagline: 'CRISPY SNACKS',
    subcategory: 'Tea Snacks'
  },
  {
    id: 'b-grocery-1',
    name: 'Roasted Cashews Packet',
    description: 'Crunchy premium quality roasted cashew nuts, lightly salted and packaged for a perfect healthy tea-time snack.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
    tagline: 'PACKAGED TREATS',
    subcategory: 'grocery'
  },

  // 2. Tea Subcategories: Normal Tea, Rabadi Tea, green tea
  {
    id: 't-normal-1',
    name: 'Cutting Masala Chai',
    description: 'Strong, freshly brewed tea boiled with thick buffalo milk, crushed ginger, black pepper, and premium green cardamom.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60',
    category: 'Tea',
    tagline: 'DESI FLAVORS',
    subcategory: 'Normal Tea',
    customizationOptions: [
      { title: 'Sweetness', options: ['Regular Sugar', 'Sugar-Free', 'Less Sugar'] }
    ]
  },
  {
    id: 't-rabadi-1',
    name: 'Shahi Rabri Chai',
    description: 'A luxurious Royal Indian tea topped with a thick scoop of slow-cooked malai Rabri, chopped almonds, pistachios, and saffron strands.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=60',
    category: 'Tea',
    tagline: 'ROYAL EXPERIENCE',
    subcategory: 'Rabadi Tea'
  },
  {
    id: 't-green-1',
    name: 'Himalayan Honey Green Tea',
    description: 'Refreshing pure organic green tea leaves steeped to perfection, finished with pure wild forest honey and squeezed fresh lemon juice.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=60',
    category: 'Tea',
    tagline: 'ANTIOXIDANT RICH',
    subcategory: 'green tea'
  },

  // 3. Coffee Subcategories: Hot Coffee, Cold Coffee
  {
    id: 'c-hot-1',
    name: 'Artisan Cappuccino',
    description: 'Smooth double shot espresso made from premium Arabica beans, folded with velvety steamed milk and capped with dense microfoam.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=60',
    category: 'Coffee',
    tagline: 'HOT BREW',
    subcategory: 'Hot Coffee',
    customizationOptions: [
      { title: 'Milk Option', options: ['Full Cream Milk', 'Oat Milk (+₹20)', 'Almond Milk (+₹20)'] }
    ]
  },
  {
    id: 'c-cold-1',
    name: 'Classic Frappe with Ice Cream',
    description: 'Chilled robust espresso blended with fresh cream and rich vanilla bean ice cream, drizzled with dark chocolate fudge syrup.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=60',
    category: 'Coffee',
    tagline: 'ICED COLD',
    subcategory: 'Cold Coffee'
  },

  // 4. Coldink Subcategories: Pepsi, ThumsUp, Energy Drink, other, Water
  {
    id: 'cd-pepsi-1',
    name: 'Chilled Pepsi Can',
    description: 'Crisp carbonated cola beverage in a chilled 330ml aluminum can, served with sliced lemon and ice cubes.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=60',
    category: 'Coldink',
    tagline: 'CARBONATED COLA',
    subcategory: 'Pepsi'
  },
  {
    id: 'cd-thumsup-1',
    name: 'Thums Up Bottle',
    description: 'Strong, highly carbonated spicy Indian cola drink with a thunderous kick. Chilled 500ml bottle.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=60',
    category: 'Coldink',
    tagline: 'STRONG COLA',
    subcategory: 'ThumsUp'
  },
  {
    id: 'cd-energy-1',
    name: 'Red Bull Energy Drink',
    description: 'Chilled premium active energy drink can. Vitalizes body and mind instantly. 250ml can.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1622543953490-0b7003957f49?w=800&auto=format&fit=crop&q=60',
    category: 'Coldink',
    tagline: 'ENERGY IN A CAN',
    subcategory: 'Energy Drink'
  },
  {
    id: 'cd-water-1',
    name: 'Premium Mineral Water',
    description: '1 Liter bottle of fresh, double-filtered packaged drinking mineral water with added electrolytes.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=60',
    category: 'Coldink',
    tagline: 'PURE HYDRATION',
    subcategory: 'Water'
  },
  {
    id: 'cd-other-1',
    name: 'Fresh Sweet Lime Soda',
    description: 'Fizzy sparkling water infused with fresh green lime juice, simple sugar syrup, and black rock salt.',
    price: 70,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=60',
    category: 'Coldink',
    tagline: 'CITRUS REFRESHER',
    subcategory: 'other'
  },

  // 5. Summer Special Subcategories: None
  {
    id: 'ss-mango-1',
    name: 'Alphonso Mango Mastani',
    description: 'A classic thick mango shake loaded with fresh mango chunks, premium vanilla ice cream, glazed cherries, and chopped pistachios.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=60',
    category: 'Summer Special',
    tagline: 'MANGO CRUSH'
  },
  {
    id: 'ss-mojito-1',
    name: 'Cool Citrus Mint Mojito',
    description: 'A perfect thirst quencher. Muddled lime wedges, fresh mint leaves, brown cane sugar, ice, and crisp white soda.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=60',
    category: 'Summer Special',
    tagline: 'COOL REFRESHER'
  },

  // 6. Dinner Subcategories: Water
  {
    id: 'd-water-1',
    name: 'Dinner Mineral Water',
    description: 'Chilled packaged pure spring drinking mineral water, 1 Liter bottle to accompany your royal dinner.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=60',
    category: 'Dinner',
    tagline: 'PURE HYDRATION',
    subcategory: 'Water'
  },
  {
    id: 'd-curry-1',
    name: 'Shahi Butter Chicken & Naan',
    description: 'Tender tandoori chicken cooked in a rich, buttery, spiced tomato-cream gravy, served with one freshly baked garlic butter naan.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
    category: 'Dinner',
    tagline: 'ROYAL MAIN COURSE',
    customizationOptions: [
      { title: 'Naan Type', options: ['Garlic Butter Naan', 'Plain Naan', 'Tandoori Roti'] }
    ]
  },

  // 7. Icecream Subcategories: None
  {
    id: 'ic-kesar-1',
    name: 'Premium Kesar Pista Scoop',
    description: 'Traditional slow-churned sweet milk ice cream loaded with natural Kashmiri saffron threads, crunchy pistachios, and green cardamoms.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80',
    category: 'Icecream',
    tagline: 'DESI DELIGHT'
  },
  {
    id: 'ic-fudge-1',
    name: 'Triple Chocolate Brownie Fudge',
    description: 'Creamy chocolate ice cream folded with warm fudge brownie chunks, chocolate syrup ripples, and premium dark chocolate chips.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60',
    category: 'Icecream',
    tagline: 'CHOCOLATE HEAVEN'
  }
];

// In-memory mock database state for orders (to simulate the POS sync offline)
const mockOrders: Record<string, Order> = {};

export const PocketBaseService = {
  /**
   * Fetches the business name and logo configuration from PocketBase.
   * Falls back to local defaults if offline or collection doesn't exist.
   */
  async getBusinessInfo(): Promise<{ name: string; logoUrl: string | null }> {
    try {
      const record = await pb.collection('business_profile').getFirstListItem('');
      if (record) {
        return {
          name: record.name || 'Elevated',
          logoUrl: record.logo ? pb.getFileUrl(record, record.logo) : null
        };
      }
    } catch (e) {
      console.log('Business profile fetch failed. Trying settings...');
      try {
        const record = await pb.collection('settings').getFirstListItem('');
        if (record) {
          return {
            name: record.name || 'Elevated',
            logoUrl: record.logo ? pb.getFileUrl(record, record.logo) : null
          };
        }
      } catch (err) {
        console.log('PocketBase settings fetch failed. Using fallback business info.');
      }
    }
    return { name: 'Elevated', logoUrl: null };
  },

  /**
   * Fetches menu items from PocketBase
   * Falls back to high-quality mock data if PocketBase is offline.
   */
  async getMenu(): Promise<MenuItem[]> {
    try {
      const records = await pb.collection('menu_items').getFullList<any>({
        sort: 'category',
      });
      
      if (records.length > 0) {
        return records.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price: r.price,
          image: r.image ? pb.getFileUrl(r, r.image) : '',
          category: r.category,
          tagline: r.tagline,
          customizationOptions: r.customizationOptions || [],
          subcategory: r.subcategory || ''
        }));
      }
    } catch (e) {
      console.log('PocketBase is not running or menu_items is empty. Using premium mock menu data.');
    }
    return MOCK_MENU;
  },

  /**
   * Submits a guest order from the PWA to PocketBase (Sent to POS).
   */
  async submitOrder(tableNumber: string, items: any[], total: number): Promise<Order> {
    const orderData = {
      tableNumber,
      items,
      total,
      status: 'pending' as const,
      created: new Date().toISOString()
    };

    try {
      const record = await pb.collection('orders').create<Order>(orderData);
      return record;
    } catch (e) {
      console.log('PocketBase is offline. Simulating order placement...');
      
      const mockOrder: Order = {
        id: `ord-${Math.random().toString(36).substr(2, 9)}`,
        ...orderData
      };
      
      mockOrders[mockOrder.id] = mockOrder;
      localStorage.setItem(`mock-order-${mockOrder.id}`, JSON.stringify(mockOrder));
      
      return mockOrder;
    }
  },

  /**
   * Listens for real-time order updates from PocketBase.
   */
  subscribeToOrderUpdates(orderId: string, onUpdate: (order: Order) => void): () => void {
    let unsubscribePocketBase = () => {};
    let simulationTimeout: any = null;

    try {
      pb.collection('orders').subscribe<Order>(orderId, (e) => {
        if (e.action === 'update') {
          onUpdate(e.record);
        }
      }).then((unsub) => {
        unsubscribePocketBase = unsub;
      });
    } catch (e) {
      console.log('PocketBase offline subscription.');
    }

    const runSimulationStep = (currentStatus: Order['status'], delay: number) => {
      simulationTimeout = setTimeout(() => {
        const localOrderString = localStorage.getItem(`mock-order-${orderId}`);
        const order = localOrderString ? JSON.parse(localOrderString) : mockOrders[orderId];
        
        if (order) {
          let nextStatus: Order['status'] = currentStatus;
          let nextDelay = 5000;

          if (currentStatus === 'pending') {
            nextStatus = 'accepted';
            nextDelay = 6000;
          } else if (currentStatus === 'accepted') {
            nextStatus = 'preparing';
            nextDelay = 8000;
          } else if (currentStatus === 'preparing') {
            nextStatus = 'ready';
            nextDelay = 6000;
          } else if (currentStatus === 'ready') {
            nextStatus = 'served';
          }

          const updatedOrder: Order = { ...order, status: nextStatus };
          mockOrders[orderId] = updatedOrder;
          localStorage.setItem(`mock-order-${orderId}`, JSON.stringify(updatedOrder));
          
          onUpdate(updatedOrder);

          if (nextStatus !== 'served') {
            runSimulationStep(nextStatus, nextDelay);
          }
        }
      }, delay);
    };

    runSimulationStep('pending', 3000);

    return () => {
      try {
        unsubscribePocketBase();
      } catch (_) {}
      if (simulationTimeout) {
        clearTimeout(simulationTimeout);
      }
    };
  }
};
