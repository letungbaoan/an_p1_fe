import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchDashboardData } from '@/redux/slices/dashboardSlice'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import { DollarSign, ShoppingBag, Users, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Review } from '@/components/product/ProductReviews'
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { data: dashboard, loading, error } = useAppSelector((state) => state.dashboard)
  const { t } = useTranslation('dashboard')
  const formatCurrency = useCurrencyFormatter()

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchDashboardData())
    }
  }, [dispatch, loading])

  if (loading === 'pending' || loading === 'idle') {
    return <div className='py-10 text-center'>{t('loading')}</div>
  }

  if (error || !dashboard) {
    return <div className='py-10 text-center text-red-500'>{t('error')}</div>
  }

  const { totalOrders, totalSales, totalUsers, recentReviews, salesChartData, chartLabels } = dashboard

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: t('sales_chart_label'),
        data: salesChartData,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    ]
  }

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: t('sales_chart_title') },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.y)
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return formatCurrency(Number(value))
          }
        }
      }
    }
  }

  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold text-gray-800'>{t('title')}</h1>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
        <KPICard title={t('total_orders')} value={totalOrders} icon={ShoppingBag} color='text-blue-500' />
        <KPICard title={t('total_sales')} value={formatCurrency(totalSales)} icon={DollarSign} color='text-green-500' />
        <KPICard title={t('total_users')} value={totalUsers} icon={Users} color='text-purple-500' />
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='rounded-xl bg-white p-6 shadow-lg lg:col-span-2'>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className='space-y-4 rounded-xl bg-white p-6 shadow-lg lg:col-span-1'>
          <h3 className='border-b pb-2 text-xl font-bold'>{t('recent_reviews')}</h3>
          <RecentReviews reviews={recentReviews.slice(0, 2)} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon }) => (
  <div className='flex items-center justify-between rounded-xl border-l-4 border-purple-600 bg-white p-4 shadow-md'>
    <div>
      <p className='text-sm font-medium text-gray-500'>{title}</p>
      <h2 className='mt-1 text-3xl font-extrabold text-gray-900'>{value}</h2>
    </div>
    <div className='rounded-full bg-gray-100 p-3'>
      <Icon size={24} />
    </div>
  </div>
)

interface RecentReviewsProps {
  reviews: Review[]
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews }) => (
  <div className='space-y-4'>
    {reviews.map((review) => (
      <div key={review.id} className='border-b pb-3'>
        <div className='flex items-center justify-between'>
          <span className='font-semibold text-gray-700'>{review.username}</span>
          <div className='flex space-x-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
        <p className='mt-1 text-sm italic text-gray-600'>&quot;{review.comment}&quot;</p>
      </div>
    ))}
  </div>
)
