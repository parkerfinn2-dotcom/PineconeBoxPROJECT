import React from 'react';

const GrowthTree = ({ treeGrowth, waterCount }) => {
  // 获取成长树图标
  const getTreeIcon = () => {
    switch (treeGrowth) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'sapling': return '🌿';
      case 'tree': return '🌳';
      case 'fruiting': return '🌲';
      default: return '🌰';
    }
  };

  return (
    <div>
      {/* 成长树主体 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
        <div style={{ 
          fontSize: treeGrowth === 'seed' ? '4rem' : treeGrowth === 'sprout' ? '5rem' : treeGrowth === 'sapling' ? '6rem' : treeGrowth === 'tree' ? '7rem' : '8rem', 
          position: 'relative', 
          zIndex: 1 
        }}>
          {getTreeIcon()}
        </div>
      </div>

      {/* 成长阶段 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginBottom: '20px' 
      }}>
        {
          [
            { stage: 'seed', icon: '🌰', name: '种子宝宝', range: '0-4次', isActive: waterCount >= 0, color: '#FFF9C4', borderColor: '#FFD54F' },
            { stage: 'sprout', icon: '🌱', name: '小芽芽', range: '5-9次', isActive: waterCount >= 5, color: '#E8F5E8', borderColor: '#81C784' },
            { stage: 'sapling', icon: '🌿', name: '幼苗苗', range: '10-14次', isActive: waterCount >= 10, color: '#C8E6C9', borderColor: '#4CAF50' },
            { stage: 'tree', icon: '🌳', name: '小树树', range: '15-19次', isActive: waterCount >= 15, color: '#A5D6A7', borderColor: '#388E3C' },
            { stage: 'fruiting', icon: '🌲', name: '大树结果', range: '20+次', isActive: waterCount >= 20, color: '#81C784', borderColor: '#2E7D32' }
          ].map((stage, index) => (
            <div key={stage.stage} style={{ 
              flex: '1 1 calc(20% - 10px)', 
              textAlign: 'center', 
              padding: '15px', 
              backgroundColor: stage.isActive ? stage.color : 'var(--card-bg)', 
              borderRadius: '15px', 
              border: stage.isActive ? `2px solid ${stage.borderColor}` : '2px solid transparent', 
              transition: 'all 0.3s ease',
              boxShadow: stage.isActive ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stage.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem', color: stage.isActive ? stage.borderColor : 'var(--text-color)' }}>{stage.name}</div>
              <div style={{ fontSize: '12px', color: stage.isActive ? stage.borderColor : 'var(--text-color)', marginTop: '3px' }}>{stage.range}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default GrowthTree;