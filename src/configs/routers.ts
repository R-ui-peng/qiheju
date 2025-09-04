import INDEX from '../pages/index.jsx';
import FOOD_DETAIL from '../pages/food-detail.jsx';
import CART from '../pages/cart.jsx';
import ORDER_MANAGEMENT from '../pages/order-management.jsx';
import ADMIN_DASHBOARD from '../pages/admin-dashboard.jsx';
import MENU_MANAGEMENT from '../pages/menu-management.jsx';
import ADMIN_ORDERS from '../pages/admin-orders.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "food-detail",
  component: FOOD_DETAIL
}, {
  id: "cart",
  component: CART
}, {
  id: "order-management",
  component: ORDER_MANAGEMENT
}, {
  id: "admin-dashboard",
  component: ADMIN_DASHBOARD
}, {
  id: "menu-management",
  component: MENU_MANAGEMENT
}, {
  id: "admin-orders",
  component: ADMIN_ORDERS
}]