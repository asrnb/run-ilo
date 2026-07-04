import dynamic from 'next/dynamic'

const RouteTracerLoader = dynamic(() => import('./route-tracer'), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full rounded-xl bg-gray-100 animate-pulse" />
  ),
})

export default RouteTracerLoader
