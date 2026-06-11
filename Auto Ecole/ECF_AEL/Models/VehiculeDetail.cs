namespace ECF_AEL.Models
{
    public class VehiculeDetail
    {
        public string NoImmat { get; set; } = string.Empty;
        public string ModeleVehicule { get; set; } = string.Empty;
        public string Marque { get; set; } = string.Empty;
        public string Annee { get; set; } = string.Empty;
        public DateOnly DateAchat { get; set; }
        public bool Etat { get; set; }
    }
}
