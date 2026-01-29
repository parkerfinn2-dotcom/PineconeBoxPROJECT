import { useState, useEffect, useRef } from 'react'
import './App.css'

// 水母数据库
const jellyfishDatabase = {
  orders: [
    {
      name: "立方水母目",
      families: [
        {
          name: "立方水母科",
          genera: [
            {
              name: "箱水母属",
              species: [
                {
                  id: "box-jellyfish",
                  name: "澳大利亚箱水母",
                  scientificName: "Chironex fleckeri",
                  size: "钟状体直径可达30厘米",
                  habitat: "澳大利亚北部和东南亚海域",
                  depth: "表层至20米",
                  toxicity: "剧毒",
                  glow: false,
                  description: "世界上最毒的水母之一，触须上的刺细胞含有强毒性神经毒素",
                  rarity: "rare"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "根口水母目",
      families: [
        {
          name: "根口水母科",
          genera: [
            {
              name: "海蜇属",
              species: [
                {
                  id: "jellyfish",
                  name: "海蜇",
                  scientificName: "Rhopilema esculentum",
                  size: "钟状体直径可达50厘米",
                  habitat: "中国沿海、日本、韩国海域",
                  depth: "表层至40米",
                  toxicity: "低毒",
                  glow: false,
                  description: "可食用水母，在中国被广泛养殖",
                  rarity: "common"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "旗口水母目",
      families: [
        {
          name: "游水母科",
          genera: [
            {
              name: "海月水母属",
              species: [
                {
                  id: "moon-jellyfish",
                  name: "海月水母",
                  scientificName: "Aurelia aurita",
                  size: "钟状体直径可达40厘米",
                  habitat: "全球温带海域",
                  depth: "表层至100米",
                  toxicity: "无毒",
                  glow: true,
                  description: "最常见的水母之一，伞部呈圆盘状，有4个马蹄形生殖腺",
                  rarity: "common"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "冠水母目",
      families: [
        {
          name: "冠水母科",
          genera: [
            {
              name: "冠水母属",
              species: [
                {
                  id: "crown-jellyfish",
                  name: "冠水母",
                  scientificName: "Cephea cephea",
                  size: "钟状体直径可达50厘米",
                  habitat: "热带和亚热带海域",
                  depth: "50-500米",
                  toxicity: "低毒",
                  glow: true,
                  description: "伞部呈冠状，边缘有许多触手",
                  rarity: "uncommon"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "十字水母目",
      families: [
        {
          name: "十字水母科",
          genera: [
            {
              name: "十字水母属",
              species: [
                {
                  id: "stalked-jellyfish",
                  name: "十字水母",
                  scientificName: "Stenoscyphus inabai",
                  size: "钟状体直径可达2厘米",
                  habitat: "浅海岩石海岸",
                  depth: "0-10米",
                  toxicity: "无毒",
                  glow: false,
                  description: "小型水母，通常附着在海藻或岩石上",
                  rarity: "uncommon"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

function App() {
  const [activeView, setActiveView] = useState('encyclopedia') // encyclopedia 或 screensaver
  const [isNight, setIsNight] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState(null)
  const [jellyfishes, setJellyfishes] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [expandedFamilies, setExpandedFamilies] = useState({})
  const [expandedGenera, setExpandedGenera] = useState({})
  const sceneRef = useRef(null)

  // 初始化水母
  useEffect(() => {
    const initialJellyfishes = []
    jellyfishDatabase.orders.forEach(order => {
      order.families.forEach(family => {
        family.genera.forEach(genus => {
          genus.species.forEach(species => {
            initialJellyfishes.push({
              ...species,
              x: Math.random() * 800 - 400,
              y: Math.random() * 600 - 300,
              size: Math.random() * 40 + 30,
              speed: Math.random() * 0.5 + 0.2,
              color: species.glow ? `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.8)` : `rgba(155, 155, 255, 0.6)`,
              glow: species.glow ? `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.5)` : `rgba(155, 155, 255, 0.2)`
            })
          })
        })
      })
    })
    setJellyfishes(initialJellyfishes)
  }, [])

  // 水母动画
  useEffect(() => {
    const animate = () => {
      setJellyfishes(prev => prev.map(jellyfish => ({
        ...jellyfish,
        x: jellyfish.x + jellyfish.speed,
        y: jellyfish.y + Math.sin(Date.now() * 0.001 + jellyfish.id.charCodeAt(0)) * 0.2
      })))
      requestAnimationFrame(animate)
    }
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // 切换分类展开状态
  const toggleOrder = (orderName) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderName]: !prev[orderName]
    }))
  }

  const toggleFamily = (familyName) => {
    setExpandedFamilies(prev => ({
      ...prev,
      [familyName]: !prev[familyName]
    }))
  }

  const toggleGenus = (genusName) => {
    setExpandedGenera(prev => ({
      ...prev,
      [genusName]: !prev[genusName]
    }))
  }

  // 选择水母物种
  const selectSpecies = (species) => {
    setSelectedSpecies(species)
  }

  return (
    <div className="app">
      {activeView === 'encyclopedia' ? (
        <div className="encyclopedia-view">
          {/* 左侧分类树 */}
          <div className="classification-tree">
            <h2>水母分类</h2>
            {jellyfishDatabase.orders.map(order => (
              <div key={order.name} className="order">
                <div 
                  className="category-header"
                  onClick={() => toggleOrder(order.name)}
                >
                  <span>{order.name}</span>
                  <span className="toggle-icon">{expandedOrders[order.name] ? '▼' : '▶'}</span>
                </div>
                {expandedOrders[order.name] && (
                  <div className="subcategories">
                    {order.families.map(family => (
                      <div key={family.name} className="family">
                        <div 
                          className="category-header"
                          onClick={() => toggleFamily(family.name)}
                        >
                          <span>{family.name}</span>
                          <span className="toggle-icon">{expandedFamilies[family.name] ? '▼' : '▶'}</span>
                        </div>
                        {expandedFamilies[family.name] && (
                          <div className="subcategories">
                            {family.genera.map(genus => (
                              <div key={genus.name} className="genus">
                                <div 
                                  className="category-header"
                                  onClick={() => toggleGenus(genus.name)}
                                >
                                  <span>{genus.name}</span>
                                  <span className="toggle-icon">{expandedGenera[genus.name] ? '▼' : '▶'}</span>
                                </div>
                                {expandedGenera[genus.name] && (
                                  <div className="subcategories">
                                    {genus.species.map(species => (
                                      <div 
                                        key={species.id}
                                        className={`species ${species.rarity} ${selectedSpecies?.id === species.id ? 'selected' : ''}`}
                                        onClick={() => selectSpecies(species)}
                                      >
                                        <span>{species.name}</span>
                                        <span className="scientific-name">{species.scientificName}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 右侧展示区 */}
          <div className="display-area">
            <div className={`ocean-scene ${isNight ? 'night' : 'day'}`} ref={sceneRef}>
              {/* 深海背景 */}
              <div className="ocean-background"></div>
              
              {/* 粒子效果 */}
              <div className="particles"></div>
              
              {/* 水母 */}
              {jellyfishes.map(jellyfish => (
                <div 
                  key={jellyfish.id}
                  className={`jellyfish ${jellyfish.rarity} ${selectedSpecies?.id === jellyfish.id ? 'selected' : ''}`}
                  style={{
                    left: `${jellyfish.x}px`,
                    top: `${jellyfish.y}px`,
                    width: `${jellyfish.size}px`,
                    height: `${jellyfish.size * 1.2}px`,
                    backgroundColor: jellyfish.color,
                    boxShadow: `0 0 ${jellyfish.size * 0.5}px ${jellyfish.glow}`
                  }}
                  onClick={() => selectSpecies(jellyfish)}
                >
                  <div className="tentacles"></div>
                </div>
              ))}
            </div>

            {/* 信息卡 */}
            {selectedSpecies && (
              <div className="info-card">
                <h3>{selectedSpecies.name}</h3>
                <p className="scientific-name">{selectedSpecies.scientificName}</p>
                <div className="info-details">
                  <p><strong>体型：</strong>{selectedSpecies.size}</p>
                  <p><strong>栖息地：</strong>{selectedSpecies.habitat}</p>
                  <p><strong>深度范围：</strong>{selectedSpecies.depth}</p>
                  <p><strong>毒性：</strong>{selectedSpecies.toxicity}</p>
                  <p><strong>发光能力：</strong>{selectedSpecies.glow ? '是' : '否'}</p>
                  <p><strong>描述：</strong>{selectedSpecies.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="screensaver-view">
          <div className={`ocean-scene ${isNight ? 'night' : 'day'}`} ref={sceneRef}>
            {/* 深海背景 */}
            <div className="ocean-background"></div>
            
            {/* 粒子效果 */}
            <div className="particles"></div>
            
            {/* 水母 */}
            {jellyfishes.map(jellyfish => (
              <div 
                key={jellyfish.id}
                className={`jellyfish ${jellyfish.rarity}`}
                style={{
                  left: `${jellyfish.x}px`,
                  top: `${jellyfish.y}px`,
                  width: `${jellyfish.size}px`,
                  height: `${jellyfish.size * 1.2}px`,
                  backgroundColor: jellyfish.color,
                  boxShadow: `0 0 ${jellyfish.size * 0.5}px ${jellyfish.glow}`
                }}
              >
                <div className="tentacles"></div>
                <div className="species-label">{jellyfish.scientificName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 控制界面 */}
      <div className="controls">
        <button onClick={() => setActiveView(activeView === 'encyclopedia' ? 'screensaver' : 'encyclopedia')}>
          {activeView === 'encyclopedia' ? '切换到屏保模式' : '切换到百科模式'}
        </button>
        <button onClick={() => setIsNight(!isNight)}>
          {isNight ? '切换到白天' : '切换到夜晚'}
        </button>
      </div>
    </div>
  )
}

export default App