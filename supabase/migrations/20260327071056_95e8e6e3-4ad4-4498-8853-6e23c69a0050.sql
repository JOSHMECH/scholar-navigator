-- Create student_inputs table
CREATE TABLE public.student_inputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_cgpa NUMERIC(3,2) NOT NULL,
  target_cgpa NUMERIC(3,2) NOT NULL,
  study_hours INTEGER NOT NULL,
  attendance INTEGER NOT NULL,
  carry_overs INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inputs" ON public.student_inputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inputs" ON public.student_inputs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  predicted_cgpa NUMERIC(3,2) NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);