import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  notes?: string;
  frequency: string;
  color: string;
}

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Аспирин', dosage: '100 мг', time: '09:00', taken: true, notes: 'После еды', frequency: 'daily', color: 'bg-purple-100 text-purple-700' },
    { id: 2, name: 'Омега-3', dosage: '1000 мг', time: '12:00', taken: false, notes: 'Запивать водой', frequency: 'daily', color: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'Витамин D', dosage: '2000 МЕ', time: '14:00', taken: false, frequency: 'daily', color: 'bg-amber-100 text-amber-700' },
    { id: 4, name: 'Магний', dosage: '400 мг', time: '21:00', taken: false, notes: 'Перед сном', frequency: 'daily', color: 'bg-green-100 text-green-700' },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const toggleMedication = (id: number) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
    const med = medications.find(m => m.id === id);
    if (med && !med.taken) {
      toast.success(`${med.name} отмечен как принятый`, {
        description: `${med.dosage} в ${med.time}`,
      });
    }
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const completionRate = Math.round((takenCount / totalCount) * 100);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const currentDay = selectedDate.getDay();

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Контроль Лекарств
              </h1>
              <p className="text-muted-foreground">Ваше здоровье под контролем</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Icon name="Plus" size={20} />
                  Добавить лекарство
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Новое лекарство</DialogTitle>
                  <DialogDescription>
                    Добавьте препарат и настройте расписание приёма
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Название препарата</Label>
                    <Input id="name" placeholder="Например: Аспирин" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dosage">Дозировка</Label>
                      <Input id="dosage" placeholder="100 мг" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Время приёма</Label>
                      <Input id="time" type="time" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Периодичность</Label>
                    <Select>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Выберите периодичность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Ежедневно</SelectItem>
                        <SelectItem value="weekly">Еженедельно</SelectItem>
                        <SelectItem value="custom">Свой график</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Заметки</Label>
                    <Textarea id="notes" placeholder="Принимать после еды, запивать водой..." />
                  </div>
                </div>
                <Button onClick={() => {
                  toast.success('Лекарство добавлено!');
                  setIsAddDialogOpen(false);
                }}>
                  Сохранить
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Прогресс на сегодня</p>
                  <p className="text-3xl font-bold text-primary">{takenCount} из {totalCount}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{completionRate}%</div>
                  <p className="text-sm text-muted-foreground">выполнено</p>
                </div>
              </div>
              <Progress value={completionRate} className="h-3" />
            </CardContent>
          </Card>
        </header>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="today" className="gap-2">
              <Icon name="Clock" size={18} />
              Напоминания
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Icon name="Calendar" size={18} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="medications" className="gap-2">
              <Icon name="Pill" size={18} />
              Лекарства
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 animate-fade-in">
            <div className="grid gap-4">
              {medications.map((med, index) => (
                <Card
                  key={med.id}
                  className={`transition-all duration-300 hover:shadow-lg border-2 ${
                    med.taken ? 'border-success/30 bg-success/5' : 'border-border'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${med.color} text-sm px-3 py-1`}>
                            {med.time}
                          </Badge>
                          <h3 className={`text-xl font-semibold ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                            {med.name}
                          </h3>
                          {med.taken && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                              <Icon name="Check" size={14} className="mr-1" />
                              Принято
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{med.dosage}</p>
                        {med.notes && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-3">
                            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{med.notes}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="lg"
                        variant={med.taken ? 'outline' : 'default'}
                        onClick={() => toggleMedication(med.id)}
                        className="ml-4 gap-2 min-w-[140px]"
                      >
                        <Icon name={med.taken ? 'RotateCcw' : 'Check'} size={20} />
                        {med.taken ? 'Отменить' : 'Принял'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={24} />
                  Недельный график
                </CardTitle>
                <CardDescription>Отслеживайте выполнение плана приёма</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4 mb-6">
                  {getWeekDates().map((date, index) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
                    const completionForDay = index === 3 ? completionRate : Math.floor(Math.random() * 40) + 60;
                    
                    return (
                      <div
                        key={index}
                        className={`text-center p-4 rounded-xl transition-all cursor-pointer ${
                          isToday
                            ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                            : 'bg-muted hover:bg-muted/80 hover:scale-105'
                        }`}
                      >
                        <div className={`text-xs mb-1 ${isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {weekDays[dayIndex]}
                        </div>
                        <div className="text-2xl font-bold mb-2">{date.getDate()}</div>
                        <div className="flex items-center justify-center gap-1">
                          {completionForDay === 100 ? (
                            <Icon name="CheckCircle2" size={20} className="text-success" />
                          ) : (
                            <span className="text-xs font-semibold">{completionForDay}%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-primary" />
                    Статистика за неделю
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-2 border-success/30 bg-success/5">
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-success mb-1">96%</div>
                        <p className="text-sm text-muted-foreground">Выполнение</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-blue-300 bg-blue-50">
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-blue-700 mb-1">27</div>
                        <p className="text-sm text-muted-foreground">Принято</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-orange-300 bg-orange-50">
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-orange-700 mb-1">1</div>
                        <p className="text-sm text-muted-foreground">Пропущено</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="animate-fade-in">
            <div className="grid gap-4">
              {medications.map((med) => (
                <Card key={med.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${med.color.split(' ')[0]}`} />
                          {med.name}
                        </CardTitle>
                        <CardDescription>
                          {med.dosage} • {med.frequency === 'daily' ? 'Ежедневно' : med.frequency} в {med.time}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreVertical" size={20} />
                      </Button>
                    </div>
                  </CardHeader>
                  {med.notes && (
                    <CardContent>
                      <div className="flex items-start gap-2 text-sm bg-muted p-3 rounded-lg">
                        <Icon name="FileText" size={16} className="mt-0.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{med.notes}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
