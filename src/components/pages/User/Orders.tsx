import { Fragment, useEffect, useState } from "react";
import { Toast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ICartState } from "@/store/interfaces/ICartState";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/store/interfaces/IState";
import { OrdersActions } from "@/store/OrdersSlice";
import OrderDrawer from "./OrderDrawer";
import Header from "@/components/base/Header";
import Footer from "@/components/base/Footer";
import OrderSummary from "./OrderSummary";
import { getOrders, deleteOrder } from "@/helpers/api";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OrderList() {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const orders = useSelector((state: IState) => state.Orders.orders);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);
  const [confirm, setConfirm] = useState<{ orderId: string | number } | null>(null);

  // Filters
  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Completed",
    "Cancelled",
    "Failed",
    "Returned",
    "All"
  ];
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const fetchOrders = async () => {
    try {
      const orders = await getOrders();
      dispatch(OrdersActions.loadOrders(orders || []));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order: ICartState) => {
    dispatch(OrdersActions.showOrderDetail(order as any));
    setIsDrawerOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!confirm) return;
    setDeletingId(confirm.orderId);
    setConfirm(null);
    const success = await deleteOrder(confirm.orderId);
    if (success) {
      await fetchOrders();
      setToast({ message: "Order cancelled successfully.", type: "success" });
    } else {
      setToast({ message: "Failed to cancel order. Please try again.", type: "error" });
    }
    setDeletingId(null);
  };

  // Filtering logic
  const filteredOrders = orders?.filter(order => {
    const statusMatch = statusFilter === "All" ? true : order.status === statusFilter;
    let dateMatch = true;
    if (dateFrom) {
      dateMatch = dateMatch && new Date(order.created_at) >= new Date(dateFrom);
    }
    if (dateTo) {
      // Add 1 day to include the end date
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      dateMatch = dateMatch && new Date(order.created_at) < toDate;
    }
    return statusMatch && dateMatch;
  }) || [];
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, dateFrom, dateTo]);

  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(() => {
    // Closed by default on mobile, open on desktop
    return !isMobile;
  });

  // Keep showFilters in sync with isMobile if screen size changes
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  return (
    <Fragment>
      <Header />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Dialog
        open={!!confirm}
        title="Cancel Order"
        onClose={() => setConfirm(null)}
        actions={
          <>
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setConfirm(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={confirmCancelOrder}
              disabled={deletingId === confirm?.orderId}
            >
              {deletingId === confirm?.orderId ? 'Cancelling...' : 'Yes'}
            </button>
          </>
        }
      >
        Are you sure you want to cancel this order?
      </Dialog>
      <div className="p-6 min-h-[80vh] bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

        {/* Filters with up/down arrow toggle */}
        <div className="mb-6">
          <div
            className="bg-white/90 border border-gray-200 rounded-xl shadow-sm px-3 py-2 cursor-pointer flex items-center justify-between select-none"
            onClick={() => isMobile && setShowFilters((v) => !v)}
          >
            <span className="text-sm font-semibold text-gray-700">Filters</span>
            {isMobile && (
              showFilters ? (
                <ChevronUp className="w-5 h-5 text-[#5dbf13] transition-transform" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#5dbf13] transition-transform" />
              )
            )}
          </div>
          {showFilters && (
            <div className="bg-white/90 border-x border-b border-gray-200 rounded-b-xl shadow-sm px-3 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between animate-fade-in-up">
              <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto md:justify-start">
                <label htmlFor="status-select" className="text-xs md:text-sm text-gray-700 font-medium md:mr-2">Status</label>
                <select
                  id="status-select"
                  className="border rounded px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-[#5dbf13] focus:outline-none bg-white font-semibold w-full md:w-auto"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  onClick={e => e.stopPropagation()}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto md:justify-end">
                <div className="flex gap-2 items-center w-full md:w-auto">
                  <label className="text-xs md:text-sm text-gray-700">From</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-2 text-xs md:text-sm w-full md:w-auto"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    max={dateTo || undefined}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <div className="flex gap-2 items-center w-full md:w-auto">
                  <label className="text-xs md:text-sm text-gray-700">To</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-2 text-xs md:text-sm w-full md:w-auto"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <button
                  className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs md:text-sm font-semibold border border-gray-300 w-full md:w-auto"
                  onClick={e => {
                    e.stopPropagation();
                    setStatusFilter("All");
                    setDateFrom("");
                    setDateTo("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table for md+ screens */}
        <div className="overflow-hidden rounded-xl shadow border border-gray-200 hidden md:block">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-green-100 to-green-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedOrders.map((order, idx) => {
                  let orderDate = '';
                  if (order.created_at) {
                    const d = new Date(order.created_at);
                    orderDate = d.toLocaleString('en-US', {
                      month: 'short', day: '2-digit', year: 'numeric'
                    });
                  }
                  return (
                    <motion.tr
                      key={order.id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-gray-700 font-mono">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{orderDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.cartitems?.length || 0} product{order.cartitems?.length === 1 ? '' : 's'}
                        {` ${order.totalquantity} item${order.totalquantity === 1 ? '' : 's'}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.status || 'Pending'}</td>
                      <td className="px-4 py-3 text-center flex gap-2 justify-center">
                        <Button
                          className="bg-[#5DBF13] text-white px-4 py-1 rounded-lg hover:bg-green-700 shadow-sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </Button>
                        {/* Cancel button moved to Order Details */}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {/* Card layout for mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          <AnimatePresence>
            {paginatedOrders.map((order, idx) => {
              let orderDate = '';
              if (order.created_at) {
                const d = new Date(order.created_at);
                orderDate = d.toLocaleString('en-US', {
                  month: 'short', day: '2-digit', year: 'numeric'
                });
              }
              return (
                <motion.div
                  key={order.id || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono text-gray-500">{order.id}</span>
                    <span className="text-xs text-gray-400">{orderDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 font-semibold">
                      {order.cartitems?.length || 0} product{order.cartitems?.length === 1 ? '' : 's'}
                      {` ${order.totalquantity} item${order.totalquantity === 1 ? '' : 's'}`}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="bg-[#5DBF13] text-white px-4 py-1 rounded-lg hover:bg-green-700 shadow-sm flex-1"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </Button>
                    {/* Cancel button moved to Order Details */}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Drawer */}
      <OrderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <OrderSummary />
      </OrderDrawer>
      <Footer />
    </Fragment>
  );
}
