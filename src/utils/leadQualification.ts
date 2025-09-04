/**
 * Verifica se um lead é desqualificado baseado na especialidade
 */
export const isDisqualifiedLead = (especialidade: string): boolean => {
  const disqualifiedSpecialties = [
    'Estética Geral (salão, micro, make)'
  ];
  
  return disqualifiedSpecialties.includes(especialidade);
};
