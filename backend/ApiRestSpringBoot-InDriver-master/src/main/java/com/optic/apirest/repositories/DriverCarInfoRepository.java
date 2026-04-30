package com.optic.apirest.repositories;

import com.optic.apirest.models.DriverCarInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverCarInfoRepository extends JpaRepository<DriverCarInfo, Long> {
}
