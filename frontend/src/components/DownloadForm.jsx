import { useState, useEffect } from 'preact/hooks';


const DownloadForm = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('best');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [supportedSites, setSupportedSites] = useState([]);

  // Cargar sitios soportados al montar el componente
  useEffect(() => {
    const loadSupportedSites = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/supported-sites/');
        const data = await response.json();
        setSupportedSites(data.supported_sites);
      } catch (error) {
        console.error('Error cargando sitios soportados:', error);
      }
    };
    loadSupportedSites();
  }, []);

  // Verificar URL cuando cambia
  const checkUrl = async (urlToCheck) => {
    if (!urlToCheck || urlToCheck.length < 10) return;
    
    setChecking(true);
    setVideoInfo(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/check-url/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToCheck })
      });
      const data = await response.json();
      
      if (data.supported) {
        setVideoInfo(data);
        setMessage('✅ URL soportada - Video encontrado');
      } else {
        setMessage('❌ URL no soportada');
        setVideoInfo(null);
      }
    } catch (error) {
      setMessage('⚠️ No se pudo verificar la URL');
      setVideoInfo(null);
    }
    
    setChecking(false);
  };

  // Verificar URL con delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (url) checkUrl(url);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:8000/api/download/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        setVideoInfo(data.video_info);
      } else if (data.warning) {
        setMessage(data.warning);
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || 'Error desconocido'));
    }
    
    setLoading(false);
  };

  const getSiteIcon = (url) => {
    if (!url) return '🌐';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return '🎬';
    if (url.includes('vimeo.com')) return '🎭';
    if (url.includes('tiktok.com')) return '🎵';
    if (url.includes('twitch.tv')) return '🎮';
    if (url.includes('facebook.com')) return '📘';
    if (url.includes('instagram.com')) return '📷';
    if (url.includes('twitter.com') || url.includes('x.com')) return '🐦';
    if (url.includes('dailymotion.com')) return '📺';
    return '🌐';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Desconocida';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getMessageStyle = () => {
    if (message.includes('Error') || message.includes('❌')) {
      return {
        backgroundColor: '#2d1b1b',
        borderColor: '#dc2626',
        color: '#ef4444'
      };
    }
    if (message.includes('⚠️')) {
      return {
        backgroundColor: '#2d2a1b',
        borderColor: '#f59e0b',
        color: '#fbbf24'
      };
    }
    if (message.includes('✅')) {
      return {
        backgroundColor: '#1b2d23',
        borderColor: '#16a34a',
        color: '#22c55e'
      };
    }
    return {
      backgroundColor: '#1e2a3a',
      borderColor: '#000000ff',
      color: '#000000ff'
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <span style={{ fontSize: '40px' }}>⬇️</span>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Descargador Universal de Videos
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            maxWidth: '512px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Descarga videos en formato MP4 desde YouTube, Vimeo, TikTok, Twitch y más de 1000 sitios web de forma rápida y segura
          </p>
        </div>

        {/* Main Form Card */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          border: '1px solid #334155',
          overflow: 'hidden',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0
            }}>
              <span>▶️</span>
              Descargar Video
            </h2>
          </div>
          
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* URL Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  marginBottom: '12px'
                }}>
                  URL del Video
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="url" 
                    value={url}
                    onInput={(e) => setUrl(e.target.value)}
                    placeholder="Pega aquí la URL del video (YouTube, Vimeo, TikTok, etc.)"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '16px 48px 16px 16px',
                      border: `2px solid ${videoInfo ? '#10b981' : '#475569'}`,
                      borderRadius: '12px',
                      fontSize: '1.125rem',
                      backgroundColor: videoInfo ? '#1b2d23' : (loading ? '#374151' : '#374151'),
                      color: '#f8fafc',
                      transition: 'all 0.2s',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!videoInfo) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!videoInfo) {
                        e.target.style.borderColor = '#475569';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.25rem'
                  }}>
                    {checking ? '⏳' : getSiteIcon(url)}
                  </div>
                </div>

                {/* Video Info Card */}
                {videoInfo && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #1b2d23, #047857)',
                    border: '1px solid #10b981',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ color: '#10b981', fontSize: '1.25rem' }}>✅</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontWeight: '600',
                          color: '#d1fae5',
                          fontSize: '1.125rem',
                          marginBottom: '8px',
                          margin: '0 0 8px 0'
                        }}>
                          {videoInfo.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '16px',
                          fontSize: '0.875rem',
                          color: '#a7f3d0'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>👤</span>
                            <span>{videoInfo.uploader}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>⏱️</span>
                            <span>{formatDuration(videoInfo.duration)}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>🌐</span>
                            <span>{videoInfo.extractor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Selector */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  marginBottom: '12px'
                }}>
                  Calidad del Video (MP4)
                </label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #475569',
                    borderRadius: '12px',
                    fontSize: '1.125rem',
                    backgroundColor: loading ? '#374151' : '#374151',
                    color: '#f8fafc',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#475569';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="best">🎯 Mejor calidad disponible (MP4)</option>
                  <option value="worst">📦 Peor calidad (MP4, archivo pequeño)</option>
                  <option value="bestvideo[height<=2160]+bestaudio/best[height<=2160]">📺 2160p (4K UHD, MP4)</option>
                  <option value="bestvideo[height<=1440]+bestaudio/best[height<=1440]">🖥️ 1440p (2K QHD, MP4)</option>
                  <option value="bestvideo[height<=1080]+bestaudio/best[height<=1080]">🖥️ 1080p (Full HD, MP4)</option>
                  <option value="bestvideo[height<=720]+bestaudio/best[height<=720]">📺 720p (HD, MP4)</option>
                  <option value="bestvideo[height<=480]+bestaudio/best[height<=480]">📱 480p (MP4)</option>
                  <option value="bestvideo[height<=360]+bestaudio/best[height<=360]">📟 360p (MP4)</option>
                </select>
              </div>

              {/* Download Button */}
              <button 
                onClick={handleSubmit}
                disabled={loading || !url || !videoInfo}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  border: 'none',
                  cursor: loading || !url || !videoInfo ? 'not-allowed' : 'pointer',
                  background: loading || !url || !videoInfo 
                    ? '#64748b' 
                    : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: loading || !url || !videoInfo ? '#94a3b8' : 'white',
                  boxShadow: loading || !url || !videoInfo 
                    ? 'none' 
                    : '0 10px 25px rgba(59, 130, 246, 0.4)',
                  transform: loading || !url || !videoInfo ? 'none' : 'scale(1)'
                }}
                onMouseOver={(e) => {
                  if (!loading && url && videoInfo) {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading && url && videoInfo) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                    Descargando MP4...
                  </>
                ) : (
                  <>
                    <span>⬇️</span>
                    Descargar Video MP4
                  </>
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                ...getMessageStyle()
              }}>
                <span style={{ fontWeight: '500' }}>
                  {message.replace(/[✅❌⚠️]/g, '').trim()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          
          {/* Supported Sites */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            border: '1px solid #334155',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #3730a3)',
              padding: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                <span>🌐</span>
                Sitios Soportados
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {supportedSites.slice(0, 8).map((site, index) => (
                  <div key={index} style={{
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #334155, #475569)',
                    border: '1px solid #1e40af',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#dbeafe',
                    textAlign: 'center'
                  }}>
                    {site}
                  </div>
                ))}
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                textAlign: 'center',
                fontStyle: 'italic',
                margin: 0
              }}>
                Y muchos más... este descargador soporta <strong>más de 1000 sitios web</strong>
              </p>
            </div>
          </div>

          {/* Quality Info */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            border: '1px solid #334155',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              padding: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                <span>👁️</span>
                Resoluciones
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { res: '2160p', desc: '4K Ultra HD (3840×2160)' },
                  { res: '1440p', desc: '2K QHD (2560×1440)' },
                  { res: '1080p', desc: 'Full HD (1920×1080)' },
                  { res: '720p', desc: 'HD (1280×720)' },
                  { res: '480p', desc: 'SD (854×480)' },
                  { res: '360p', desc: 'Low (640×360)' }
                ].map((qualityItem, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <span style={{ fontWeight: '600', color: '#06b6d4' }}>{qualityItem.res}</span>
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{qualityItem.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                border: '1px solid #3b82f6',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#dbeafe',
                  textAlign: 'center',
                  fontWeight: '500',
                  margin: 0
                }}>
                  💡 Todos los videos se convierten automáticamente a <strong>MP4</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          marginTop: '32px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          border: '1px solid #334155',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #166534, #15803d)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}>
              <span>✅</span>
              Características Principales
            </h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '2rem'
                }}>
                  ⬇️
                </div>
                <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#f8fafc', marginBottom: '8px' }}>
                  Descarga Rápida
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Descarga videos en alta calidad con la máxima velocidad disponible
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '2rem'
                }}>
                  ✅
                </div>
                <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#f8fafc', marginBottom: '8px' }}>
                  100% Gratuito
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Servicio completamente gratuito sin límites ni restricciones
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '2rem'
                }}>
                  🌐
                </div>
                <h4 style={{ fontWeight: '600', fontSize: '1.125rem', color: '#f8fafc', marginBottom: '8px' }}>
                  Multi-Plataforma
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Compatible con más de 1000 sitios web populares
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', color: '#94a3b8' }}>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Powered by yt-dlp • Todos los derechos reservados a Luis Riquelme
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DownloadForm;