export const brands = ["Faasos", "Oven Story", "Behrouz Biryani", "Sweet Truth", "The Good Bowl"];

export const foodItems = [
  {
    id: 1,
    name: "Classic Chicken Wrap",
    brand: "Faasos",
    price: 189,
    description: "Tender chicken pieces with fresh veggies and special sauce wrapped in a soft paratha.",
    isVeg: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    nutrition: { calories: 450, protein: 25, fats: 18, carbs: 45 },
    customizations: {
      base: [
        { id: "b1", name: "Maida Paratha", price: 0 },
        { id: "b2", name: "Wheat Paratha", price: 20 }
      ],
      sides: [
        { id: "s1", name: "Potato Wedges", price: 50 },
        { id: "s2", name: "Cheese Dip", price: 30 }
      ],
      beverages: [
        { id: "v1", name: "Thums Up", price: 40 },
        { id: "v2", name: "Water Bottle", price: 20 }
      ]
    }
  },
  {
    id: 2,
    name: "Double Cheese Margherita",
    brand: "Oven Story",
    price: 249,
    description: "Loaded with extra cheese and Italian herbs on a signature crust.",
    isVeg: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80",
    nutrition: { calories: 600, protein: 20, fats: 30, carbs: 65 },
    customizations: {
      base: [
        { id: "b3", name: "Thin Crust", price: 0 },
        { id: "b4", name: "Cheese Burst", price: 99 }
      ],
      sides: [
        { id: "s3", name: "Garlic Bread", price: 80 }
      ],
      beverages: [
        { id: "v1", name: "Thums Up", price: 40 }
      ]
    }
  },
  {
    id: 3,
    name: "Subz-e-Biryani",
    brand: "Behrouz Biryani",
    price: 329,
    description: "Authentic royal vegetable biryani slow-cooked with aromatic spices.",
    isVeg: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    nutrition: { calories: 550, protein: 12, fats: 20, carbs: 80 },
    customizations: {
      base: [
        { id: "b5", name: "Regular Portion", price: 0 },
        { id: "b6", name: "King Size", price: 100 }
      ],
      sides: [
        { id: "s4", name: "Extra Salan", price: 0 },
        { id: "s5", name: "Raita", price: 20 }
      ],
      beverages: [
        { id: "v3", name: "Royal Gulab Jamun (1 pc)", price: 50 }
      ]
    }
  }
];

export const banners = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
];
