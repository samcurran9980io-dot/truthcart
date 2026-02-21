import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { useAuth } from '@/hooks/useAuth';
import { getUserPlan } from '@/lib/storage';
import { CreditDisplay } from '@/components/CreditDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  BarChart3, Shield, TrendingUp, Clock, AlertTriangle,
  CheckCircle, XCircle, Star, Bell, BellOff, Settings,
  User, LogOut, ChevronRight
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { type UserPlan } from '@/lib/plans';
import { Helmet } from 'react-helmet-async';

interface ScanStats {
  total: number;
  trusted: number;
  mixed: number;
  suspicious: number;
  avgScore: number;
}

export default function Dashboard() {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<UserPlan>(getUserPlan());
  const [stats, setStats] = useState<ScanStats>({ total: 0, trusted: 0, mixed: 0, suspicious: 0, avgScore: 0 });
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const { permission, requestPermission } = useNotifications();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchStats();
    fetchRecent();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('scans')
      .select('trust_score, status')
      .eq('user_id', user.id);

    if (data && data.length > 0) {
      const total = data.length;
      const trusted = data.filter(s => s.status === 'trusted').length;
      const mixed = data.filter(s => s.status === 'mixed').length;
      const suspicious = data.filter(s => s.status === 'suspicious').length;
      const avgScore = Math.round(data.reduce((sum, s) => sum + s.trust_score, 0) / total);
      setStats({ total, trusted, mixed, suspicious, avgScore });
    }
  };

  const fetchRecent = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('scans')
      .select('id, product_name, trust_score, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setRecentScans(data);
  };

  const handleNotificationToggle = async () => {
    if (permission === 'granted') {
      toast.info('Notifications are managed in your browser settings');
    } else {
      const result = await requestPermission();
      if (result === 'granted') toast.success('Notifications enabled!');
      else toast.error('Notifications were denied');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: BarChart3, color: 'text-primary' },
    { label: 'Avg Score', value: stats.avgScore, icon: TrendingUp, color: 'text-primary' },
    { label: 'Trusted', value: stats.trusted, icon: CheckCircle, color: 'text-trusted' },
    { label: 'Suspicious', value: stats.suspicious, icon: AlertTriangle, color: 'text-suspicious' },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <Helmet>
        <title>Dashboard | TruthCart</title>
      </Helmet>
      <FloatingOrbs />
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} userPlan={userPlan} />

      <main className="container mx-auto px-4 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-card rounded-3xl p-8 shadow-premium border border-border/50 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{user?.email?.split('@')[0] || 'User'}</h1>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-2"
                  onClick={handleNotificationToggle}
                >
                  {permission === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  {permission === 'granted' ? 'Notifications On' : 'Enable Notifications'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-5 shadow-premium border border-border/50 text-center"
              >
                <card.icon className={cn('w-5 h-5 mx-auto mb-2', card.color)} />
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Credits */}
            <CreditDisplay userPlan={userPlan} variant="full" />

            {/* Recent Scans */}
            <div className="md:col-span-2 bg-card rounded-3xl p-6 shadow-premium border border-border/50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Recent Scans
                </h3>
                <Link to="/" className="text-xs text-primary hover:underline">View All →</Link>
              </div>

              {recentScans.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No scans yet. Start analyzing!</p>
              ) : (
                <div className="space-y-2">
                  {recentScans.map((scan) => (
                    <Link
                      key={scan.id}
                      to={`/report/${scan.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{scan.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-sm font-semibold',
                          scan.status === 'trusted' ? 'text-trusted' :
                          scan.status === 'suspicious' ? 'text-suspicious' : 'text-mixed'
                        )}>
                          {scan.trust_score}/100
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scan Distribution */}
          {stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-card rounded-3xl p-6 shadow-premium border border-border/50"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                Scan Distribution
              </h3>
              <div className="flex gap-1 h-8 rounded-xl overflow-hidden">
                {stats.trusted > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.trusted / stats.total) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="bg-trusted rounded-l-lg flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-background">{stats.trusted}</span>
                  </motion.div>
                )}
                {stats.mixed > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.mixed / stats.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="bg-mixed flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-background">{stats.mixed}</span>
                  </motion.div>
                )}
                {stats.suspicious > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.suspicious / stats.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-suspicious rounded-r-lg flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-background">{stats.suspicious}</span>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-trusted" /> Trusted</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-mixed" /> Mixed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-suspicious" /> Suspicious</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
