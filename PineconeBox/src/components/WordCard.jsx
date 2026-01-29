import { useState } from 'react'

const WordCard = ({ wordData }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div 
      className="word-card-container" 
      style={{
        perspective: '1000px',
        margin: '20px auto',
        maxWidth: '500px',
        cursor: 'pointer'
      }}
      onClick={handleFlip}
    >
      <div 
        className="word-card-inner" 
        style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          textAlign: 'center',
          transition: 'transform 0.8s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow)'
        }}
      >
        {/* 卡片正面 */}
        <div 
          className="word-card-front" 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px'
          }}
        >
          <div className="word" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '15px', fontWeight: 'bold' }}>
            {wordData.word}
          </div>
          <div className="phonetic" style={{ fontSize: '1.5rem', color: 'var(--secondary-color)', marginBottom: '20px' }}>
            {wordData.phonetic}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontStyle: 'italic' }}>
            点击查看详情
          </div>
        </div>
        
        {/* 卡片背面 */}
        <div 
          className="word-card-back" 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--light-color)',
            borderRadius: '20px',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            textAlign: 'center'
          }}
        >
          <div className="meaning" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '20px', fontWeight: 'bold' }}>
            {wordData.meaning}
          </div>
          
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '10px', fontWeight: 'bold' }}>
              关联词汇：
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              {wordData.relatedWords.map((relatedWord, index) => (
                <span 
                  key={index} 
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--text-color)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {relatedWord}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '10px', fontWeight: 'bold' }}>
              例句：
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: '1.6' }}>
              {wordData.sentence ? wordData.sentence.split('.')[0] + '.' : ''}
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', fontSize: '0.9rem', color: '#8d6e63' }}>
            难度：{wordData.level}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordCard