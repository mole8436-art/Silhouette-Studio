import React, { useState, useEffect, useCallback } from 'react';
import { SilhouetteConfig } from './types';
import { ColorPicker } from './components/ColorPicker';
import { Logo } from './components/Logo';
import { 
  Users, 
  Palette, 
  Maximize2 as Resize, 
  PenTool, 
  Sparkles, 
  Copy, 
  User
} from 'lucide-react';

const INITIAL_CONFIG: SilhouetteConfig = {
  count: 1,
  gender: 'male',
  mixedMaleCount: 1,
  mixedFemaleCount: 1,
  silhouetteColor: '#000000',
  bodySize: 'full-body',
  hasLines: false,
  lineColor: '#FFFFFF',
  extraDetails: '',
};

const COLOR_PRESETS = ['#000000', '#FFFFFF', '#FF0000', '#808080', '#1E3A8A', '#064E3B'];

const App: React.FC = () => {
  const [config, setConfig] = useState<SilhouetteConfig>(INITIAL_CONFIG);
  const [promptUsed, setPromptUsed] = useState<string>('');

  // Construct the prompt based on configuration
  const constructPrompt = useCallback(() => {
    let subjectDescription = '';

    if (config.gender === 'mixed') {
      const parts = [];
      if (config.mixedMaleCount > 0) parts.push(`남성 ${config.mixedMaleCount}명`);
      if (config.mixedFemaleCount > 0) parts.push(`여성 ${config.mixedFemaleCount}명`);
      subjectDescription = parts.join(', ');
      if (!subjectDescription) subjectDescription = '사람들';
    } else {
      const genderMap: Record<string, string> = { male: '남성', female: '여성' };
      subjectDescription = `${genderMap[config.gender] || '사람'} ${config.count}명`;
    }

    // English prompts for the model
    let promptSubject = '';
     if (config.gender === 'mixed') {
      const parts = [];
      if (config.mixedMaleCount > 0) parts.push(`${config.mixedMaleCount} male(s)`);
      if (config.mixedFemaleCount > 0) parts.push(`${config.mixedFemaleCount} female(s)`);
      promptSubject = parts.join(' and ');
      if (!promptSubject) promptSubject = 'a group of people';
    } else {
      promptSubject = `${config.count} ${config.gender}${config.count > 1 ? 's' : ''}`;
    }

    const sizeMap: Record<string, string> = {
      'close-up': 'close-up shot, distinct facial features visible in profile',
      'upper-body': 'upper body portrait, waist up',
      'full-body': 'full body view, standing or walking',
      'long-shot': 'long shot, small figures in distance',
    };

    let lineDescription = 'solid flat shape, no internal details';
    if (config.hasLines) {
      lineDescription = `with distinct ${config.lineColor} internal line details outlining features and clothing folds, comic book noir style`;
    }

    // Determine background color for contrast in prompt
    const bgColor = config.silhouetteColor.toLowerCase() === '#ffffff' || config.silhouetteColor.toLowerCase() === 'white' 
      ? 'black' 
      : 'white';

    const prompt = `
      Create a high-contrast 16:9 silhouette illustration.
      Subject: ${promptSubject}.
      Action/Details: ${config.extraDetails || 'standing naturally'}.
      Framing: ${sizeMap[config.bodySize]}.
      Style: Minimalist vector art, clean sharp edges.
      Colors: The figures are purely ${config.silhouetteColor} (${config.silhouetteColor === '#000000' ? 'black' : 'colored'}) silhouette. ${lineDescription}.
      Background: Isolated on a solid ${bgColor} background for easy background removal (chroma key friendly).
      Ensure the silhouette is crisp with no gradients or shadows.
    `.trim().replace(/\s+/g, ' ');

    return prompt;
  }, [config]);

  // Update preview prompt whenever config changes
  useEffect(() => {
    setPromptUsed(constructPrompt());
  }, [constructPrompt]);

  const handleGenerate = () => {
    setPromptUsed(constructPrompt());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptUsed);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg shadow-indigo-500/10 overflow-hidden border border-slate-700">
              <Logo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">나노 실루엣 스튜디오</h1>
              <p className="text-xs text-slate-400">AI Prompt Generator for Silhouette Images</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                설정
              </h2>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                
                {/* Gender Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> 성별 구성
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, gender: 'male' }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${config.gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}
                    >남성</button>
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, gender: 'female' }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${config.gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}
                    >여성</button>
                    <button
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, gender: 'mixed' }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${config.gender === 'mixed' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}
                    >혼합</button>
                  </div>
                </div>

                {/* Count Logic */}
                {config.gender === 'mixed' ? (
                  <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">남성 인원</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={config.mixedMaleCount}
                        onChange={(e) => setConfig(prev => ({ ...prev, mixedMaleCount: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">여성 인원</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={config.mixedFemaleCount}
                        onChange={(e) => setConfig(prev => ({ ...prev, mixedFemaleCount: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4" /> 인원 수
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={config.count}
                      onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="text-right text-xs text-indigo-400 font-mono">{config.count}명</div>
                  </div>
                )}

                <hr className="border-slate-800" />

                {/* Size & Color */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Resize className="w-4 h-4" /> 촬영 크기
                    </label>
                    <select 
                      value={config.bodySize}
                      onChange={(e) => setConfig(prev => ({ ...prev, bodySize: e.target.value as any }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
                    >
                      <option value="close-up">클로즈업 (얼굴/어깨)</option>
                      <option value="upper-body">상반신 (허리 위)</option>
                      <option value="full-body">전신</option>
                      <option value="long-shot">원거리 (배경 포함)</option>
                    </select>
                  </div>

                  <ColorPicker 
                    label="실루엣 색상" 
                    selectedColor={config.silhouetteColor} 
                    onChange={(c) => setConfig(prev => ({ ...prev, silhouetteColor: c }))} 
                    presets={COLOR_PRESETS}
                  />
                </div>

                <hr className="border-slate-800" />

                {/* Line Settings */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <PenTool className="w-4 h-4" /> 내부 라인 생성
                    </label>
                    <button 
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, hasLines: !prev.hasLines }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        config.hasLines ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        config.hasLines ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                   </div>
                   
                   {config.hasLines && (
                      <div className="pl-4 border-l-2 border-slate-800 animate-fadeIn">
                        <ColorPicker 
                          label="라인 색상" 
                          selectedColor={config.lineColor} 
                          onChange={(c) => setConfig(prev => ({ ...prev, lineColor: c }))} 
                          presets={['#FFFFFF', '#000000', '#FF0000', '#FFFF00']}
                        />
                      </div>
                   )}
                </div>

                {/* Extra Details */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">추가 사항 (행동, 의상 등)</label>
                  <textarea 
                    value={config.extraDetails}
                    onChange={(e) => setConfig(prev => ({ ...prev, extraDetails: e.target.value }))}
                    placeholder="예: 지팡이를 짚고 있음, 모자를 씀, 스마트폰을 보고 있음..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[80px] resize-none placeholder-slate-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> 프롬프트 생성하기
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Preview & Result */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Preview Area */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="text-center text-slate-600">
                <div className="flex flex-col items-center gap-2">
                   <Palette className="w-12 h-12 mb-2 opacity-50" />
                   <p className="font-medium">프롬프트 생성기</p>
                   <p className="text-sm">왼쪽에서 설정을 완료하고 생성 버튼을 누르세요</p>
                </div>
              </div>
            </div>

            {/* Prompt Display */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">생성된 프롬프트 (영어)</h3>
                <button 
                  onClick={copyToClipboard}
                  className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Copy className="w-3 h-3" /> 텍스트 복사
                </button>
              </div>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed border border-slate-800/50">
                {promptUsed || '설정을 변경하면 프롬프트가 자동으로 생성됩니다.'}
              </div>
            </div>

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-indigo-400 font-bold text-sm mb-1">16:9 최적화</h4>
                <p className="text-xs text-slate-500">영상 소스나 유튜브 썸네일에 바로 사용할 수 있는 비율입니다.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-indigo-400 font-bold text-sm mb-1">배경 제거 용이</h4>
                <p className="text-xs text-slate-500">고대비 단색 배경으로 '마법봉' 툴로 쉽게 누끼를 딸 수 있습니다.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-indigo-400 font-bold text-sm mb-1">AI 프롬프트</h4>
                <p className="text-xs text-slate-500">생성된 프롬프트를 복사하여 AI 이미지 생성 도구에 사용하세요.</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
