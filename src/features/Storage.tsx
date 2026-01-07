import { useState, useEffect } from 'react';
import { Card } from '@/ui/components/base';
import { StatSet, StepSet } from '@/domain/types';
import { Database, Download, Upload, Trash2, Save, Play } from 'lucide-react';

interface StorageData {
  old: StatSet;
  delta: StatSet;
  pCustom: number;
  effSteps?: StepSet;
}

interface Props {
  current: StorageData;
  onLoad: (data: StorageData) => void;
}

export const StorageSection = ({ current, onLoad }: Props) => {
  const [saveName, setSaveName] = useState("");
  const [saves, setSaves] = useState<string[]>([]);
  const [selectedSave, setSelectedSave] = useState("");

  useEffect(() => {
    updateList();
  }, []);

  const updateList = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("tori_v2_"));
    setSaves(keys.map(k => k.replace("tori_v2_", "")));
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    const data = { ...current, savedAt: Date.now() };
    localStorage.setItem("tori_v2_" + saveName, JSON.stringify(data));
    updateList();
    setSelectedSave(saveName);
  };

  const handleLoad = () => {
    if (!selectedSave) return;
    const raw = localStorage.getItem("tori_v2_" + selectedSave);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      onLoad(data);
      setSaveName(selectedSave);
    } catch(e) { console.error(e); }
  };

  const handleDelete = () => {
    if (!selectedSave) return;
    if (!confirm(`'${selectedSave}' 삭제할까요?`)) return;
    localStorage.removeItem("tori_v2_" + selectedSave);
    updateList();
    setSelectedSave("");
  };
  
  const handleExport = () => {
      if (!selectedSave) return;
      const raw = localStorage.getItem("tori_v2_" + selectedSave);
      if(!raw) return;
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `torifun-${selectedSave}.json`;
      a.click();
      URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-none shadow-xl shadow-indigo-100/30 p-0 overflow-hidden bg-white mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
          {/* Save New */}
          <div className="flex-1 flex items-center gap-2 p-4 border-b md:border-b-0 md:border-r border-slate-100">
             <Database className="w-4 h-4 text-indigo-500 ml-1" />
             <input 
                value={saveName} 
                onChange={e => setSaveName(e.target.value)} 
                placeholder="세팅 이름 입력..." 
                className="flex-1 bg-transparent border-none text-[12px] font-bold outline-none placeholder:text-slate-300"
             />
             <button 
               onClick={handleSave} 
               disabled={!saveName.trim()}
               className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-20"
             >
               <Save className="w-4 h-4" />
             </button>
          </div>
          
          {/* List & Load */}
          <div className="flex-[1.5] flex items-center gap-2 p-2 bg-slate-50/50">
             <select 
               value={selectedSave} 
               onChange={e => setSelectedSave(e.target.value)}
               className="flex-1 bg-white border border-slate-200 rounded-lg h-9 px-3 text-[11px] font-black outline-none focus:border-indigo-300 transition-all appearance-none cursor-pointer"
             >
                <option value="">저장된 세팅 불러오기</option>
                {saves.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             
             <div className="flex gap-1 pr-2">
               <button 
                 onClick={handleLoad} 
                 disabled={!selectedSave} 
                 className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-20 transition-all flex items-center gap-2"
               >
                 <Play className="w-3 h-3 fill-current" />
                 Load
               </button>
               
               <button 
                 onClick={handleDelete} 
                 disabled={!selectedSave} 
                 className="h-9 w-9 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-0 transition-all"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>

          {/* Import/Export */}
          <div className="flex gap-1 p-2 border-t md:border-t-0 md:border-l border-slate-100">
             <button onClick={handleExport} disabled={!selectedSave} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-all" title="JSON 내보내기">
               <Download className="w-4 h-4" />
             </button>
             <button onClick={() => document.getElementById('importFile')?.click()} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all" title="JSON 가져오기">
               <Upload className="w-4 h-4" />
             </button>
             <input type="file" id="importFile" className="hidden" accept=".json" onChange={async (e) => {
                const file = e.target.files?.[0];
                if(!file) return;
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  const name = file.name.replace(".json", "").replace("torifun-", "");
                  localStorage.setItem("tori_v2_" + name, JSON.stringify(data));
                  updateList();
                  setSelectedSave(name);
                } catch(err) { alert("Invalid JSON"); }
                e.target.value = "";
             }} />
          </div>
      </div>
    </Card>
  );
};
