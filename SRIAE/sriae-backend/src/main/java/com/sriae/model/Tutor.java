package com.sriae.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tutor")
public class Tutor {

    @Id
    @Column(name = "id_tutor")
    private Integer idTutor;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_tutor")
    private Usuario usuario;

    @Column(name = "parentesco", length = 50)
    private String parentesco;

    @Column(name = "telefono_emergencia", length = 20)
    private String telefonoEmergencia;

    public Integer getIdTutor() { return idTutor; }
    public void setIdTutor(Integer idTutor) { this.idTutor = idTutor; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    public String getTelefonoEmergencia() { return telefonoEmergencia; }
    public void setTelefonoEmergencia(String telefonoEmergencia) { this.telefonoEmergencia = telefonoEmergencia; }
}
