'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedCart = localStorage.getItem('donSanguchazo_cart');
      const storedUser = localStorage.getItem('donSanguchazo_user');
      const storedFavs = localStorage.getItem('donSanguchazo_favorites');

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedUser) setActiveUser(JSON.parse(storedUser));
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('donSanguchazo_cart', JSON.stringify(cart));
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (activeUser) localStorage.setItem('donSanguchazo_user', JSON.stringify(activeUser));
      else localStorage.removeItem('donSanguchazo_user');
    }
  }, [activeUser, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('donSanguchazo_favorites', JSON.stringify(favorites));
  }, [favorites, isLoaded]);


  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const uniqueId = product.cartItemId || product._id;
      const existingProduct = prevCart.find(item => (item.cartItemId || item._id) === uniqueId);
      
      if (existingProduct) {
        return prevCart.map(item => 
          (item.cartItemId || item._id) === uniqueId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // NUEVO: Eliminar un producto entero
  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => prevCart.filter(item => (item.cartItemId || item._id) !== uniqueId));
  };

  // NUEVO: Sumar 1 a la cantidad
  const increaseQuantity = (uniqueId) => {
    setCart((prevCart) => prevCart.map(item => 
      (item.cartItemId || item._id) === uniqueId 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    ));
  };

  // NUEVO: Restar 1 a la cantidad (sin dejar que baje de 1)
  const decreaseQuantity = (uniqueId) => {
    setCart((prevCart) => prevCart.map(item => {
      if ((item.cartItemId || item._id) === uniqueId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const getTotalItems = () => {
    if (!isLoaded) return 0; 
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => setCart([]);

  // --- LÓGICA DE USUARIOS ---
  const loginUser = async (userData) => {
    setActiveUser(userData);
    const dbFavorites = userData.favorites || [];
    const guestFavorites = favorites;
    const mergedFavorites = [...dbFavorites];

    guestFavorites.forEach(guestFav => {
      const alreadyExists = mergedFavorites.some(dbFav => dbFav._id === guestFav._id);
      if (!alreadyExists) mergedFavorites.push(guestFav);
    });

    setFavorites(mergedFavorites);

    if (guestFavorites.length > 0) {
      try {
        await fetch(`/api/users/${userData._id}/favorites`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites: mergedFavorites })
        });
      } catch (error) {
        console.error("Error al sincronizar los favoritos:", error);
      }
    }
  };

  const logoutUser = () => {
    setActiveUser(null);
    setFavorites([]);
  };

  // --- LÓGICA DE FAVORITOS ---
  const toggleFavorite = async (product) => {
    const isFav = favorites.some(fav => fav._id === product._id);
    let newFavorites = isFav ? favorites.filter(fav => fav._id !== product._id) : [...favorites, product];
    setFavorites(newFavorites);

    if (activeUser) {
      try {
        await fetch(`/api/users/${activeUser._id}/favorites`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites: newFavorites })
        });
      } catch (error) {
        console.error("Error guardando favoritos:", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, getTotalItems, clearCart, 
      removeFromCart, increaseQuantity, decreaseQuantity, // <-- EXPORTAMOS LOS NUEVOS PODERES
      activeUser, loginUser, logoutUser,
      favorites, toggleFavorite, isLoaded 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}